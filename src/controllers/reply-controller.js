const Reply = require('../models/reply-modal');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');

exports.addReplyToComment =  catchAsyncError(async (req, res, next) => {
    const { content } = req.body;
    const comment = req.params.commentId;
    const user = req.user.id;
    const reply = await Reply.create({content, comment, user});
    res.status(201).json({
        status: 'success',
        reply
    });
});

exports.getAllRepliesForComment =  catchAsyncError(async (req, res, next) => {
    const replies = await Reply.find({comment: req.params.commentId}).populate({
        path: 'user',
        select: 'firstName lastName'
    });
    res.status(200).json({
        status: 'success',
        total: replies.length,
        data: replies
    });
});

exports.deleteReply =  catchAsyncError(async (req, res, next) => {
    const reply = await Reply.findByIdAndDelete(req.params.replyId);
    if(!reply) {
        return next(new AppError('Reply not found!!', 404))
    }
    res.status(204).json(null);
});

exports.updateReply =  catchAsyncError(async (req, res, next) => {
    const { content } = req.body;
    const updatedReply = await Reply.findByIdAndUpdate(req.params.replyId,  { content }, {
        runValidators: true,
        new: true // returns updated doc
    }).select('-__v');
    if (!updatedReply) {
        return next(new AppError('Reply not found!!', 404))
    }
    res.status(200).json({
        status: 'success',
        updatedReply
    });
});