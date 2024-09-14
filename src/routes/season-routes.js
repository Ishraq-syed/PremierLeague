const express = require('express');
const teamRouter = require('../routes/team-routes');
const fixtureRouter = require('../routes/fixture-routes');
const seasonController = require('../controllers/season-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();
router.use('/:seasonId/team', teamRouter);
router.use('/:seasonId/fixture', fixtureRouter);
router.route('/').post(authController.protect, authController.restrictTo('admin'), seasonController.addNewSeason).get(seasonController.getAllSeasons);
router.route('/:seasonId').delete(seasonController.deleteSeason).get(seasonController.getOneSeason).patch(seasonController.updateSeason);

module.exports = router;