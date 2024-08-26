const Player = require('../models/player-model');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');

exports.addNewPlayer =  catchAsyncError(async (req, res, next) => {
    const newPlayer = await Player.create({...req.body, team: req.params.teamId});
    res.status(201).json({
        status: 'success',
        player: newPlayer
    });
});

exports.getAllPlayersForATeam = catchAsyncError(async (req, res, next) => {
    const players = await Player.find({team: req.params.teamId}).sort({ jerseyNumber: 1 }).select('-__v');
    res.status(200).json({
        status: 'success',
        total: players.length,
        data: players
    });
});

exports.getOnePlayer =  catchAsyncError(async (req, res, next) => {
    const player = await Player.findOne({_id: req.params.playerId, team: req.params.teamId}).select('-__v');
    if (!player) {
        return next(new AppError('Player not found', 404));
    }
    res.status(200).json({
        status: 'success',
        player
    });
});

exports.deletePlayer =  catchAsyncError(async (req, res, next) => {
    const player = await Player.findOneAndDelete({_id: req.params.playerId, team: req.params.teamId});
    if (!player) {
        return next(new AppError('Player not found', 404));
    }
    res.status(204).json(null);
});

exports.updatePlayer =  catchAsyncError(async (req, res, next) => {
    const player = await Player.findOne({_id: req.params.playerId, team: req.params.teamId}).select('-__v');
    if (!player) {
        return next(new AppError('Player not found', 404));
    }
    for (let k in req.body) {
        player[k] = req.body[k]
    }
    await player.save();
    res.status(200).json({
        status: 'success',
        player
    });
});
