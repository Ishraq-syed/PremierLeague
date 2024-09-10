const express = require('express');
const playerController = require('../controllers/player-controller');

const router = express.Router({
    mergeParams: true
});

router.get('/getPlayerStats/:playerId', playerController.getPlayerStats);
router.route('/').post(playerController.addNewPlayer).get(playerController.getAllPlayersForATeam);
router.route('/:playerId').delete(playerController.deletePlayer).get(playerController.getOnePlayer).patch(playerController.updatePlayer);

module.exports = router;