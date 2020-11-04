const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');
const Message = require('../models/message.model');
const crypto = require('crypto');

require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

const encrypt = (message) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedMessage: encrypted.toString('hex'), key: key.toString('hex')}
}


const createMessage = async (sender, userToken, recipient, message) => {
    let _info = null;
    await User.findOne({_id: sender, token: userToken})
    .then(async user => {
        if(user) await User.findOne({email: recipient})
        .then(_user => {
            if(_user){
                if(!_user.communications.includes(sender)) _user.communications.push(sender)
                const encryptedMessage = encrypt(message);
                const _message = new Message({recipient: _user._id, sender, iv: encryptedMessage.iv, message: encryptedMessage.encryptedMessage, key: encryptedMessage.key})
                _message.save()
                _info = {
                    recipient: {email: _user.email, id: _user._id}, sender: {email: _user.email, id: _user._id},
                    iv: encryptedMessage.iv, message: encryptedMessage.encryptedMessage, key: encryptedMessage.key
                }
            }
        })
    })
    return _info;
}

const startMessage = async (sender, userToken, recipient) => {
    User.findOne({_id: sender, token: userToken}, (err, user) => {
        if(err) return null;
        else if(!user) return null;
        else{
            User.findOne({email: recipient}, async (err, _user) => {
                if(err) return null;
                else if(!_user) return null;
                else{
                    if(!user.communications.includes(_user._id)){
                        user.communications.push(_user._id)
                        await user.save()
                        .then(() => {return true})
                        .catch(() => {return null;})
                    }
                }
            })
        }
    })
}

router.post('/get_messages', jsonParser, (req, res) => {
    const {user, token, target} = req.body;
    User.findOne({_id: user, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.");
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Message.find({sender: user, recipient: target}, (err, message) => {
                if(err) res.status(500).json("Something went wrong.");
                else{
                    Message.find({sender: target, recipient: user}, (err, _message) => {
                        if(err) res.status(500).json("Something went wrong.");
                        else{
                            res.json(message.concat(_message))
                        }
                    })
                }
            })
        }
    })
})

module.exports = {createMessage, router, startMessage}