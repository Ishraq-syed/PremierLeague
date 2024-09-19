const express = require('express');
const commentController = require('../controllers/comment-controller');
const replyController = require('../controllers/reply-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.use(authController.protect)

router.route('/:fixtureId').post(commentController.addNewComment).get(commentController.getAllCommentsForfixture);
router.route('/:commentId').delete(commentController.deleteComment).patch(commentController.updateComment);
router.route('/:commentId/reply').post(replyController.addReplyToComment).get(replyController.getAllRepliesForComment);
router.route('/:commentId/reply/:replyId').delete(replyController.deleteReply).patch(replyController.updateReply);

module.exports = router;