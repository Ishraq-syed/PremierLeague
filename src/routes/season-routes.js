const express = require('express');
const teamRouter = require('../routes/team-routes');
const seasonController = require('../controllers/season-controller');

const router = express.Router();
router.use('/:seasonId/team', teamRouter);
router.route('/').post(seasonController.addNewSeason).get(seasonController.getAllSeasons);
router.route('/:seasonId').delete(seasonController.deleteSeason).get(seasonController.getOneSeason).patch(seasonController.updateSeason);

module.exports = router;