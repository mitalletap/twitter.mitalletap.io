const mongoose = require('mongoose');

Friend = require('./friend.model');
FriendSchema = mongoose.model("Friend").schema;

const PostSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username: String,
    message: String,
    profilePicture: String,
    likes: [FriendSchema],
    dislikes: [FriendSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);