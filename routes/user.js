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
            res.json(400);
        } else {
            if(succ.length > 0) {
                res.json(succ);
            } else {
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
            res.send(succ);
        } else {
            if(isValid(req.body)) {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId,
                    username: req.body.username,
                    name: req.body.name,
                    profilePicture: `https://s3.${process.env.REACT_APP_BUCKET_REGION}.amazonaws.com/${process.env.REACT_APP_BUCKET_NAME}/profile-picture-${username}`,
                    profileCover: `https://s3.${process.env.REACT_APP_BUCKET_REGION}.amazonaws.com/${process.env.REACT_APP_BUCKET_NAME}/profile-cover-${username}`
                })
                newUser.save()
                .catch((err) => console.log(err));
                res.send(true);
            } else {
                res.json(400);
            }
        }
    })
})

// Update Profile Picture and Cover
router.post('/update/:username', async (req, res) => {
    var response;
    console.log(req.body);
    const username = req.params.username;
    const update = {
        profilePicture: req.body.ppURL,
        profileCover: req.body.pCURL
    }
    var resp = await User.findOneAndUpdate({ username: username }, update, { new: true })
    .catch((err) => console.log(err));
    res.json(true);
})


// Get User Pictures
router.get('/profile-images/:username', (req, res) => {
    var username = req.params.username;
    User.find({ 'username': username }, function(err, succ) {
        if(err) {
            res.json(400);
        } else {
            if(succ.length > 0) {
                const object = {
                    "profilePicture": succ[0].profilePicture,
                    "profileCover": succ[0].profileCover,
                }
                res.send(object);
            } else {
                res.json({ "message": "User does not exist" });
            }
        }
    });
});

// Check Following Status
router.get('/check-following-status/:username/:searchedUsername', (req, res) => {
    var username = req.params.username;
    var searchedUsername = req.params.searchedUsername;
    User.find({'username': username}, function(err, succ) {
        if(err) {
            res.json({status: 'failed'})
        } else if(succ[0].followers.length === 0) {
            res.json({ "error": "no followers" })
        } else {
            for(var i = 0; i <= succ[0].followers.length; i++) {
                if(succ[0].followers[i].username === searchedUsername){
                    res.json({status: true})
                    break;
                } else {
                    res.json({status: false})
                    break;
                }
            }
        }
    })
});

// Add Follower/Following

router.post('/add-follower/:username/:searchedUsername', async (req, res) => {
    console.log("Checking Follow Status");
    var username = req.params.username;
    var searchedUsername = req.params.searchedUsername;
    var status = req.body.status;
    var startUserPP = req.body.startUserPP;
    var endUserPP = req.body.endUserPP;

    const searchedUsernameUpdate = { username: searchedUsername, profilePicture: endUserPP }
    const usernameUpdate = { username: username, profilePicture: startUserPP }
    const usernameNotification = { username: username, type: "Connection", resolved: false }

    if(status === true) {
        // Remove Follower
        User.findOneAndUpdate({ username: username }, { $pull : { following: searchedUsernameUpdate } }, { new: true })
        .catch((err) => console.log(err));

        User.findOneAndUpdate({ username: searchedUsername }, { $pull : { followers: usernameUpdate } }, { new: true })
        .catch((err) => console.log(err));
        res.json({ "status": false });

    } else {
        // Add Follower
        User.findOneAndUpdate({ username: username }, { $push : { following: searchedUsernameUpdate } }, { new: true })
        .catch((err) => console.log(err));

        User.findOneAndUpdate({ username: searchedUsername }, { $push : { followers: usernameUpdate, notifications: usernameNotification } }, { new: true })
        .catch((err) => console.log(err));
        res.json({ "status": true });
    }
});



module.exports = router;



