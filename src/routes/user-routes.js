const express = require('express');
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.patch('/update', authController.protect, userController.updateUser);
router.patch('/updatePassword', authController.protect, authController.updatePassword);

module.exports = router;