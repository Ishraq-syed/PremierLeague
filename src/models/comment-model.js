const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'A comment cannot be blank']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    fixture: {
        type: mongoose.Schema.ObjectId,
        ref: 'Fixture'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;