const express = require('express');
const seasonController = require('../controllers/season-controller');

const router = express.Router();

router.route('/').post(seasonController.addNewSeason).get(seasonController.getAllSeasons);
router.route('/:seasonId').delete(seasonController.deleteSeason).get(seasonController.getOneSeason).patch(seasonController.updateSeason);

module.exports = router;