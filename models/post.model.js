const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username: String,
    message: String,
    profilePicture: String
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);