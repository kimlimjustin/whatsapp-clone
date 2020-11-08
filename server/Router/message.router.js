const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');
const Message = require('../models/message.model');
const crypto = require('crypto');
const Group = require('../models/group.model');

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
                if(!_user.communications.includes(sender)){
                    _user.communications.push(sender);
                    _user.save();
                }
                const encryptedMessage = encrypt(message);
                const _message = new Message({recipient: _user._id, sender, iv: encryptedMessage.iv, message: encryptedMessage.encryptedMessage, key: encryptedMessage.key})
                _message.save()
                _info = {
                    recipient: {email: _user.email, id: _user._id}, sender: {email: user.email, id: user._id},
                    iv: encryptedMessage.iv, message: encryptedMessage.encryptedMessage, key: encryptedMessage.key
                }
            }
        })
    })
    return _info;
}

const createGroupMessage = async (sender, userToken, group, message) => {
    let _info = null;
    await User.findOne({_id: sender, token: userToken})
    .then(async user => {
        if(user) await Group.findOne({_id: group})
        .then(group => {
            if(group){
                const encryptedMessage = encrypt(message);
                const _message = new Message({recipient: group._id, sender, iv: encryptedMessage.iv, message: encryptedMessage.encryptedMessage, key: encryptedMessage.key})
                _message.save()
                _info = {
                    recipient: {id: group._id, member: group.member, code: group.code}, sender: {email: user.email, id: user._id},
                    iv: encryptedMessage.iv, message: encryptedMessage.encryptedMessage, key: encryptedMessage.key
                }
            }
        })
    })
    return _info
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
                    if(!user.communications.includes(_user._id) && sender !== recipient){
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
            User.findOne({email: target}, (err, _user) => {
                if(err) res.status(500).json("Something went wrong.");
                else if(!_user) res.status(404).json("User not found.")
                else{
                    Message.find({sender: user, recipient: _user._id})
                    .then(message => {
                        Message.find({sender: _user._id, recipient: user}, (err, _message) => {
                            if(err) res.status(500).json("Something went wrong.");
                            else{
                                let result = message.concat(_message)
                                result.sort((a, b) => { 
                                    return new Date(a.createdAt) - new Date(b.createdAt)
                                });
                                let finalResult = []
                                result.forEach(msg => {
                                    if(String(msg.sender) === String(user._id)){
                                        _info = {
                                            recipient: {email: _user.email, id: _user._id}, sender: {email: user.email, id: user._id},
                                            iv: msg.iv, message: msg.message, key: msg.key
                                        }
                                    }else{
                                        _info = {
                                            recipient: {email: user.email, id: user._id}, sender: {email: _user.email, id: _user._id},
                                            iv: msg.iv, message: msg.message, key: msg.key
                                        }
                                    }
                                    finalResult.push(_info)
                                })
                                res.json(finalResult)
                            }
                        })
                    })
                    .catch(() => {res.status(500).json("Something went wrong.");})
                }
            })
        }
    })
})

router.post('/get_group_messages', jsonParser, (req, res) => {
    const {user, token, target} = req.body;
    User.findOne({_id: user, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.");
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Group.findOne({code: target}, (err, group) => {
                if(err) res.status(500).json(err);
                else if(!group) res.status(404).json("Group not found.")
                else{
                    Message.find({recipient: group._id})
                    .then(messages => {
                        let finalResult = [];
                        const getMessages = new Promise((resolve, reject) => {
                            messages.forEach((message, index, array) => {
                                if(message.sender !== user._id){
                                    User.findById(message.sender)
                                    .then(sender => {
                                        finalResult.push({sender: {id: sender._id, email: sender.email}, recipient: {id: group._id, group: group.code},
                                        iv: message.iv, message: message.message, key: message.key})
                                    })
                                    .then(() => {if(index === array.length - 1 || array.length === 0) resolve()})
                                }else{
                                    finalResult.push({sender: {id: user._id, email: user.email}, recipient: {id: group._id},
                                    iv: message.iv, message: message.message, key: message.key})
                                    if(index === array.length - 1 || array.length === 0) resolve()
                                }
                            })
                        })
                        getMessages
                        .then(() => res.json(finalResult))
                    })
                    .catch((err) => {res.status(500).json("Something went wrong.");})
                }
            })
        }
    })
})

module.exports = {createMessage, messageRouter: router, startMessage, createGroupMessage}