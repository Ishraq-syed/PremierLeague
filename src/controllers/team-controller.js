const Team = require('../models/team-model');
const teamService = require('../services/team-service');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');
const Fixture = require('../models/fixture-model');

exports.addNewTeam =  catchAsyncError(async (req, res, next) => {
    const newTeam = await Team.create({...req.body, season: req.params.seasonId});
    res.status(201).json({
        status: 'success',
        newTeam
    });
});

exports.getAllTeams =  catchAsyncError(async (req, res, next) => {
    const teamsRes = await Team.find().select('-__v').populate('homeFixtures').populate('awayFixtures');
    const teams = teamService.calculateTeamStats(teamsRes);
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

exports.getTeamPlayerStats =  catchAsyncError(async (req, res, next) => {
    const fixturesForAteam = await Fixture.aggregate([
        {
            $facet: {
                homeGoalStats: [
                    {
                        $match:  {
                            $expr: { 
                                    $or: 
                                    [ 
                                        { homeTeam: req.params.teamId }, 
                                        { awayTeam: req.params.teamId} 
                                    ] 
                                }
                            }
                    },
                    {
                        $group: {
                            _id: '$stats.homeGoalStats.scorer',
                        }
                    },
                    {
                            $unwind: {
                                path: '$_id',
                            }
                    },
                    {
                        $lookup: {
                            from: 'players',
                            localField: "_id",
                            foreignField: "_id",
                            as: "playerInfo"
                        }
                    },
                    {
                        $unwind: {
                            path: '$playerInfo',
                        }
                    },
                    {
                        $group: {
                            _id: '$playerInfo',
                            goals: {
                                $sum: 1
                            }
                        }
                    }, 
                    {
                        $project: {
                            _id: 0,
                            playerInfo: '$_id',
                            goals: '$goals'
                        }
                    }
                ],
                awayGoalStats: [
                    {
                        $match:  {
                            $expr: { 
                                    $or: 
                                    [ 
                                        { homeTeam: req.params.teamId }, 
                                        { awayTeam: req.params.teamId} 
                                    ] 
                                }
                            }
                    },
                     {
                        $group: {
                            _id: '$stats.awayGoalStats.scorer',
                        }
                    },
                    {
                            $unwind: {
                                path: '$_id',
                            }
                    },
                    
                    {
                        $lookup: {
                            from: 'players',
                            localField: "_id",
                            foreignField: "_id",
                            as: "playerInfo"
                        }
                    },
                    {
                        $unwind: {
                            path: '$playerInfo',
                        }
                    },
                    {
                        $group: {
                            _id: '$playerInfo',
                            goals: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            playerInfo: '$_id',
                            goals: '$goals'
                        }
                    }
                ],
            }
        }
    ]);
    const proccesdPlayerData = teamService.processPlayerGoalsBasedOnHomeOrAwayFixtures(fixturesForAteam, req.params.teamId);
    res.status(200).json({
        status: 'success',
        result: proccesdPlayerData
    });
});