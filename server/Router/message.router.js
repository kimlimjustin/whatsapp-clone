const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');
const Message = require('../models/message.model');

require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

const generateToken = () => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(50);
}

const createMessage = async (sender, userToken, recipient, message) => {
    User.findOne({_id: sender, userToken}, async (err, user) => {
        if(err) return null;
        else if(!user) return null;
        else{
            User.findOne({email: recipient}, async (err, user) => {
                if(err) return null;
                else if(!user) return null;
                else{
                    const token = generateToken();
                    const _message = new Message({recipient, sender, token, message})
                    await _message.save()
                    .then(() => {return true})
                    .catch(() => {return null;})
                }
            })
        }
    })
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