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

router.post('/create', jsonParser, (req, res) => {
    const {owner, token, name} = req.body;
    User.findOne({_id: owner, token}, jsonParser, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            const token = generateToken(50);
            const group = new Group({admin: owner, name, token})
            group.save()
            .then(() => {message: "Group created.", group})
            .catch(() => res.status(500),json("Something went wrong."))
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

router.get('/get_by_id/:id', jsonParser, (req, res) => {
    const id = req.params.id;
    Group.findById(id)
    .then(group => res.json(group) )
    .catch(() => res.status(500).json("Something went wrong."))
})