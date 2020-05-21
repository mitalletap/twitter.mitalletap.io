const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username: String,
    type: String,
    resolved: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);