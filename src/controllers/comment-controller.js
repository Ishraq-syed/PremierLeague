const Comment = require('../models/comment-model');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');

exports.addNewComment =  catchAsyncError(async (req, res, next) => {
    const { content } = req.body;
    const fixture = req.params.fixtureId;
    const user = req.user.id;
    const comment = await Comment.create({content, fixture, user});
    res.status(201).json({
        status: 'success',
        comment
    });
});

exports.getAllCommentsForfixture =  catchAsyncError(async (req, res, next) => {
    const comments = await Comment.find({fixture: req.params.fixtureId}).populate({
        path: 'user',
        select: 'firstName lastName'
    });
    res.status(200).json({
        status: 'success',
        total: comments.length,
        data: comments
    });
});

exports.deleteComment =  catchAsyncError(async (req, res, next) => {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(204).json(null);
});

exports.updateComment =  catchAsyncError(async (req, res, next) => {
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,  { content }, {
        runValidators: true,
        new: true // returns updated doc
    }).select('-__v');
    res.status(200).json({
        status: 'success',
        updatedComment
    });
});