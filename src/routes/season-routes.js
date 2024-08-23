const express = require('express');
const seasonController = require('../controllers/season-controller');

const router = express.Router();

router.route('/').post(seasonController.addNewSeason);

module.exports = router;