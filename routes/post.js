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
        res.json(succ.reverse());
    });
    console.log("Accessing all posts");
})

// Save a post to the database
router.post('/', (req, res) => {
    if(isValid(req.body)) {
        var url; 
        var username = req.body.username;
        User.find({ 'username': username }, function(err, succ) {
            if(err) {
                console.log(`An error occured:`, err);
                res.json(400);
            } else {
                if(succ.length > 0) {
                    console.log(url);
                    url = succ[0].profilePicture
                    const newPost = new Post({
                        _id: new mongoose.Types.ObjectId,
                        username: req.body.username,
                        message: req.body.message,
                        "Hello": "World",
                        profilePicture: url
                    });
                    newPost.save()
                    .then(() => console.log(`Saved message: ${req.body.message}`))
                    .catch(err => console.log(err));
                    console.log(url);
            
                    // User.findOneAndUpdate({ username: username }, { $push: { posts: newPost } }, function(err, succ) {
                    //     if(err) {
                    //         console.log(err);
                    //     } else {
                            // newPost.save()
                            // .then(() => console.log(`Saved message: ${req.body.message}`))
                            // .catch(err => console.log(err));
                    //     }
                    // })
                    res.send(true);
                }
            }
        });

        
    } else {
        res.json({ "response": "post is not valid" });
    }
})

// Get all posts for a specific user
router.get('/:username', (req, res) => {
    var username = req.params.username;
    Post.find({ 'username': username }, function(err, succ) {
        if(err){
            console.log('There was an error: ' + err);
            res.json(400);
        } else {
            res.json(succ.reverse());
        }
    })
});

module.exports = router;