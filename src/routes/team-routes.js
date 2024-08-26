const express = require('express');
const teamController = require('../controllers/team-controller');
const playerRouter = require('../routes/player-routes');

const router = express.Router({
    mergeParams: true
});

router.use('/:teamId/player', playerRouter)
router.route('/').post(teamController.addNewTeam).get(teamController.getAllTeams);
router.route('/:teamId').delete(teamController.deleteTeam).get(teamController.getOneTeam).patch(teamController.updateTeam);

module.exports = router;