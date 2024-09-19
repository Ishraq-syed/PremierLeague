const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'A reply to a comment cannot be blank']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    comment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;