const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();

var User = require('../models/user.model');

function isValid(object) {
    const username = object.username;
    const name = object.name;
    return username.length > 0 && name.length > 0;
}

// Search for user
router.get('/:username', (req, res) => {
    var username = req.params.username;
    User.find({ 'username': username }, function(err, succ) {
        if(err) {
            console.log(`An error occured:`, err);
            res.json(400);
        } else {
            if(succ.length > 0) {
                console.log(`Successfully found ${username}:`, succ);
                res.json(succ);
            } else {
                console.log(`${username} does not exist`);
                res.json({ "message": "User does not exist" });
            }
        }
    });
});


// Add user to database
router.post('/:username', (req, res) => {
    User.find({ username: req.body.username }, function(err, succ) {
        const username = req.body.username;
        if(succ.length > 0) {
            console.log(`${username} exists in the database!`);
            res.send(succ);
        } else {
            if(isValid(req.body)) {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId,
                    username: req.body.username,
                    name: req.body.name
                })
                newUser.save()
                .then(() => console.log(`Saved ${username} to the database`))
                .catch((err) => console.log(err));
                res.send(true);
            } else {
                console.log(`There was an error saving ${username} to the database`);
                res.json(400);
            }
        }
    })
})





module.exports = router;