const mongoose = require('mongoose');
Post = require('./post.model');
PostSchema = mongoose.model("Post").schema;


Friend = require('./friend.model');
FriendSchema = mongoose.model("Friend").schema;


const UserSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    username: String,
    posts: [PostSchema],
    followers: [FriendSchema],
    following: [FriendSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);