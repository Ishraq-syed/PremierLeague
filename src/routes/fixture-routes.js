const express = require('express');
const fixtureController = require('../controllers/fixture-controller');


const router = express.Router({
    mergeParams: true
});

router.route('/').post(fixtureController.addNewFixture);

router.route('/:teamId').get(fixtureController.getFixtureForTeam);
// router.route('/:fixtureId').get(playerController.getOneFixture);

module.exports = router;