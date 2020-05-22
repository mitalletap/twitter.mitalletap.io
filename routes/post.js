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
})

// Save a post to the database
router.post('/', (req, res) => {
    if(isValid(req.body)) {
        var url; 
        var username = req.body.username;
        User.find({ 'username': username }, function(err, succ) {
            if(err) {
                res.json(400);
            } else {
                if(succ.length > 0) {
                    console.log(url);
                    url = succ[0].profilePicture
                    const newPost = new Post({
                        _id: new mongoose.Types.ObjectId,
                        username: req.body.username,
                        message: req.body.message,
                        profilePicture: url,
                        likes: [{username: username}],
                        dislikes: []
                    });
                    newPost.save()
                    .catch(err => console.log(err));
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
            res.json(400);
        } else {
            res.json(succ.reverse());
        }
    })
});


// Get status of user's Like or Dislike on Post
router.get('/:id/:username', (req, res) => {
    const id = req.params.id;
    const username = req.params.username;

    Post.find({ _id: id }, function(err, succ) {
        if(err) {
            console.log(`Post ${id} not found`);
            res.json({ status: "Post not found" });
        } else {
            if(succ[0].likes.length === 0 && succ[0].dislikes.length === 0) {
                res.json({ status: "Post not found" });
            } else {
                for(var i = 0; i < succ[0].likes.length; i++) {
                    if(succ[0].likes[i].username === username) {
                        console.log("Found a like");
                        res.send({ status: 'liked' });
                        break;
                    }
                }
                for(var i = 0; i < succ[0].dislikes.length; i++) {
                    if(succ[0].dislikes[i].username === username) {
                        console.log("Found a dislike");
                        res.send({ status: 'disliked' });
                        break;
                    }
                }
            }
        }
    });
});


// Add Username to Post Likes or Dislikes
router.post('/:type/:id/:username', (req, res) => {
    const type = req.params.type;
    const id = req.params.id;
    const username = req.params.username;

    Post.find({ _id: id }, function(err, succ) {
        if(err) {
            console.log(`Post ${id} not found`);
            res.json({ erro: "Post not found" });
        } else {
            const userWhoLiked = { username: username }
            if(type === 'liked') {
                Post.findOneAndUpdate({ _id: id }, { $push : { likes: userWhoLiked } }, { new: true })
                .then(console.log(`Added field `, userWhoLiked))
                .catch((err) => console.log(err));
                Post.findOneAndUpdate({ _id: id }, { $pull : { dislikes: userWhoLiked } }, { new: true })
                .catch((err) => console.log("They havent disliked it"));
            } else if (type === 'disliked') {
                Post.findOneAndUpdate({ _id: id }, { $push : { dislikes: userWhoLiked } }, { new: true })
                .catch((err) => console.log(err));
                Post.findOneAndUpdate({ _id: id }, { $pull : { likes: userWhoLiked } }, { new: true })
                .catch((err) => console.log("They havent liked it"));
            } else {
                Post.findOneAndUpdate({ _id: id }, { $pull : { likes: userWhoLiked, dislikes: userWhoLiked } }, { new: true })
                .catch((err) => console.log(err));
            }
            res.json({ success: true });    
        }
    });
});

module.exports = router;