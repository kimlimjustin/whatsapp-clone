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
            const code = generateToken(50);
            const group = new Group({admin: owner, name, code, member})
            group.save()
            .then(() => {
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

module.exports = router;