const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();

var Post = require('../models/post.model');
var User = require('../models/user.model');

function isValid(object) {
    return object.username.toString().length > 0 && object.message.toString().length > 0;
}

// Get all posts
router.get('/', (req, res) => {
    Post.find({}, function(err, succ) {
        if(err) {
            res.send("Something went wrong");
            next();
        }
        res.json(succ);
    });
    console.log("Accessing all posts");
})

// Save a post to the database
router.post('/', (req, res) => {
    console.log(req.body);
    if(isValid(req.body)) {
        const newPost = new Post({
            _id: new mongoose.Types.ObjectId,
            username: req.body.username,
            message: req.body.message
        });
        User.findOneAndUpdate({ username: req.body.username }, { $push: { posts: newPost } }, function(err, succ) {
            if(err) {
                console.log(err);
            } else {
                newPost.save()
                .then(() => console.log(`Saved message: ${req.body.message}`))
                .catch(err => console.log(err));
            }
        })
        res.send(true);
    } else {
        res.json({ "response": "post is not valid" });
    }
})

// Get all posts for a specific user
router.get('/:username', (req, res) => {
    var username = req.params.username;
    console.log(`finding posts for ${username}`)
    User.find({ 'username': username }, function(err, succ) {
        if(err){
            console.log('There was an error: ' + err);
            res.json(400);
        } else {
            console.log(`Displaying all posts for ${username}`);
            res.json(succ[0].posts);
        }
    })
});

module.exports = router;