const mongoose = require('mongoose');
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

exports.getOnePlayer = catchAsyncError(async (req, res, next) => {
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

exports.getPlayerStats = catchAsyncError(async (req, res, next) => {
    const playerStats = await Player.aggregate([
        
            {
                $match: {
                    _id:  mongoose.Types.ObjectId.createFromHexString(req.params.playerId)
                }
            },
            {
                $lookup: {
                    from: 'fixtures',
                    localField: "fixtures",
                    foreignField: "_id",
                    pipeline: [
                        {
                                $group: {
                                    _id: {
                                            awayGoalStats: '$stats.awayGoalStats.scorer',
                                            homeGoalStats: '$stats.homeGoalStats.scorer',
                                            awayAssists: '$stats.awayGoalStats.assister',
                                            homeAssists: '$stats.homeGoalStats.assister',
                                            motm: '$stats.motm'
                                    },
                                    awayGoalObjectIdsList: { $push: {
                                        $cond:[
                                            { $in: [mongoose.Types.ObjectId.createFromHexString(req.params.playerId), '$stats.awayGoalStats.scorer']},
                                            '$stats.awayGoalStats.scorer',
                                            []
                                        ]
                                            
                                    }},
                                    homeGoalObjectIdsList: { $push: {
                                        $cond:[
                                            { $in: [mongoose.Types.ObjectId.createFromHexString(req.params.playerId), '$stats.homeGoalStats.scorer']},
                                            '$stats.homeGoalStats.scorer',
                                            []
                                        ]
                                            
                                    }},
                                    awayAssistObjectIdsList: { $push: {
                                        $cond:[
                                            { $in: [mongoose.Types.ObjectId.createFromHexString(req.params.playerId), '$stats.awayGoalStats.assister']},
                                            '$stats.awayGoalStats.assister',
                                            []
                                        ]
                                    }},
                                    homeAssistObjectIdsList: { $push: {
                                        $cond:[
                                            { $in: [mongoose.Types.ObjectId.createFromHexString(req.params.playerId), '$stats.homeGoalStats.assister']},
                                            '$stats.homeGoalStats.assister',
                                            []
                                        ]
                                    }},
                                    motm: {
                                        $sum: {
                                            $cond:[
                                                { $eq: [mongoose.Types.ObjectId.createFromHexString(req.params.playerId), '$stats.motm']},
                                                1,
                                                0
                                            ]
                                        }
                                        
                                    }
                                }
                        },
                        {
                            $unwind: {
                                path: '$awayGoalObjectIdsList'
                            }
                        },
                        {
                            $unwind: {
                                path: '$homeGoalObjectIdsList'
                            }
                        },
                        {
                            $unwind: {
                                path: '$awayAssistObjectIdsList'
                            }
                        },
                        {
                            $unwind: {
                                path: '$homeAssistObjectIdsList'
                            }
                        },
                        {
                            $addFields: {
                                awayGoals: {
                                    $filter: {
                                        input: "$awayGoalObjectIdsList",
                                        as: "item",
                                        cond: { $eq: [ "$$item", mongoose.Types.ObjectId.createFromHexString(req.params.playerId)] }
                                    }
                                },
                                homeGoals: {
                                    $filter: {
                                        input: "$homeGoalObjectIdsList",
                                        as: "item",
                                        cond: { $eq: [ "$$item", mongoose.Types.ObjectId.createFromHexString(req.params.playerId)] }
                                    }
                                },
                                awayAssists: {
                                    $filter: {
                                        input: "$awayAssistObjectIdsList",
                                        as: "item",
                                        cond: { $eq: [ "$$item", mongoose.Types.ObjectId.createFromHexString(req.params.playerId)] }
                                    }
                                },
                                homeAssists: {
                                    $filter: {
                                        input: "$homeAssistObjectIdsList",
                                        as: "item",
                                        cond: { $eq: [ "$$item", mongoose.Types.ObjectId.createFromHexString(req.params.playerId)] }
                                    }
                                },
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                homeGoals: {
                                    $size: '$homeGoals'
                                },
                                awayGoals: {
                                    $size: '$awayGoals'
                                },
                                awayAssists: {
                                    $size: '$awayAssists'
                                },
                                homeAssists: {
                                    $size: '$homeAssists'
                                },
                                motm: '$motm'
                            }
                        }
                    ],
                    as: "stats"
                }
            },
            {
                $addFields: {
                    playerStats: {
                        homeGoals: {
                            $sum: {
                                $sum: '$stats.homeGoals'
                            }
                        },
                        awayGoals: {
                            $sum: {
                                $sum: '$stats.awayGoals'
                            }
                        },
                        homeAssists: {
                            $sum: {
                                $sum: '$stats.homeAssists'
                            }
                        },
                        awayAssists: {
                            $sum: {
                                $sum: '$stats.awayAssists'
                            }
                        },
                        motm: {
                            $sum: '$stats.motm'
                        }
                    }
                }
            },
            {
                $project: {
                    stats: 0,
                    fixtures: 0
                }
            }
    ]);
    
    res.status(200).json({
        status: 'success',
        playerInfo: playerStats[0]
    });
   
});
