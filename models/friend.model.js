const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    username: String
});

module.exports = mongoose.model('Friend', FriendSchema);