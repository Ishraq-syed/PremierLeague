const express = require('express');
const commentController = require('../controllers/comment-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.use(authController.protect)

router.route('/:fixtureId').post(commentController.addNewComment).get(commentController.getAllCommentsForfixture);
router.route('/:commentId').delete(commentController.deleteComment).patch(commentController.updateComment);

module.exports = router;