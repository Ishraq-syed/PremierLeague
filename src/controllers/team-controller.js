const Team = require('../models/team-model');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');

exports.addNewTeam =  catchAsyncError(async (req, res, next) => {
    const newTeam = await Team.create({...req.body, season: req.params.seasonId});
    res.status(201).json({
        status: 'success',
        newTeam
    });
});

exports.getAllTeams =  catchAsyncError(async (req, res, next) => {
    // const teams = await Team.find().select('-__v');
    const teams = await Team.aggregate([
        {
            $match: {}
        },
        {
            $addFields: {
                matchesPlayed: {
                    $add: ['$matchesWon', '$matchesLost', '$matchesDrawn']
                },
                points: {
                    $add: [
                        {
                            $multiply: ['$matchesWon', 3]
                        },
                        {
                            $multiply: ['$matchesDrawn', 1]
                        }
                    ]
                },
                goalDifference: {
                    $subtract: ['$goalsFor', '$goalsAgainst']
                }
            }
        }, 
        {
            $sort: {
                points: -1,
                goalDifference: -1,
                goalsFor: -1,
                name: 1
            }
        },
        {
            $project: {
                __v: 0
            }
        }
    ])
    res.status(200).json({
        status: 'success',
        total: teams.length,
        data: teams
    });
});

exports.getOneTeam =  catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({_id: req.params.teamId, season: req.params.seasonId}).select('-__v');
    if (!team) {
        return next(new AppError('Team not found', 404));
    }
    res.status(200).json({
        status: 'success',
        team
    });
});

exports.deleteTeam =  catchAsyncError(async (req, res, next) => {
    const team = await Team.findOneAndDelete({_id: req.params.teamId, season: req.params.seasonId});
    if (!team) {
        return next(new AppError('Team not found', 404));
    }
    res.status(204).json(null);
});

exports.updateTeam =  catchAsyncError(async (req, res, next) => {
    const updatedTeam = await Team.findOneAndUpdate({_id: req.params.teamId, season: req.params.seasonId}, req.body, {
        runValidators: true,
        new: true // returns updated doc
    }).select('-__v');
    if (!updatedTeam) {
        return next(new AppError('Team not found', 404));
    }
    res.status(200).json({
        status: 'success',
        updatedTeam
    });
});
