const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');
const Group = require('../models/group.model');

const generateToken = (n) => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(n);
}

require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

router.post('/create', jsonParser, (req, res) => {
    const {owner, token, name, member} = req.body;
    User.findOne({_id: owner, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            const code = generateToken(25);
            const group = new Group({admin: owner, name, code, member})
            group.save()
            .then(() => {
                member.forEach(_member => {
                    User.findOne({email: _member})
                    .then(user => {user.communications.push(group._id); user.save()})
                })
                user.communications.push(group._id)
                user.save()
                .then(() => res.json({message: "Group created.", group}))
            })
            .catch((err) => res.status(500).json(err))
        }
    })
})

router.post('/add/member', jsonParser, (req, res) => {
    const {token, owner, member, group} = req.body;
    User.findOne({_id: owner, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Group.findOne({_id: group}, (err, group) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!group) res.status(404).json("Group not found.")
                else{
                    group.member.push(member)
                    group.save()
                    .then(() => res.json("Success"))
                    .catch(() => res.status(500).json("Something went wrong."))
                }
            })
        }
    })
})

router.post('/get_by_id/', jsonParser, (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    if(!req.body.key) res.status(403).json("Permission denied.")
    else{
        if(key !== SECURITY_KEY) res.status(403).json("Permission denied.")
        else{
            Group.findById(id)
            .then(group => res.json(group) )
            .catch(() => res.status(500).json("Something went wrong."))
        }
    }
})

router.post('/get_by_code', jsonParser, (req, res) => {
    const {code, key} = req.body;
    if(!key) res.status(403).json("Permission denied.")
    else{
        if(key!== SECURITY_KEY) res.status(403).json("Permission denied.")
        else{
            Group.findOne({code})
            .then(group => res.json(group))
            .catch(() => res.status(500).json("Something went wrong."))
        }
    }
})

const deleteElement = (initial, value) => {
    var newArray = [];
    for(let i = 0; i< initial.length; i++){
        if(String(initial[i]) !== String(value)){
            newArray.push(initial[i])
        }
    }
    return newArray;
}

router.post('/delete', jsonParser, (req, res) => {
    const {group, token} = req.body;
    Group.findOne({_id: group})
    .then(group => {
        User.findOne({_id: group.admin, token})
        .then(user => {
            user.communications = deleteElement(user.communications, group._id)
            user.save()
            .then(() => {
                let groupId = group._id;
                const deleteCommunications = new Promise((resolve, reject) => {
                    group.member.forEach((_member, index, array) => {
                        User.findOne({email: _member})
                        .then(_user => {
                            _user.communications = deleteElement(_user.communications, groupId)
                            _user.save()
                            .then(() => {
                                if(index === array.length - 1) resolve()})
                            .catch(err => res.status(500).json(err))
                        })
                        .catch(err => res.status(500).json(err))
                    })
                })
                deleteCommunications
                .then(() => {
                    group.delete()
                    .then((res => res.json("Success")))
                    .catch(err => res.status(500).json(err))
                })
            })
            .catch(err => res.status(500).json(err))
        })
        .catch(() => res.status(500).json("Something went wrong."))
    })
    .catch(() => res.status(500).json("Something went wrong."))
})

module.exports = router;