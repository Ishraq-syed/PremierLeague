const Fixture = require('../models/fixture-model');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');

exports.addNewFixture =  catchAsyncError(async (req, res, next) => {
    const newFixture = await Fixture.create({...req.body, season: req.params.seasonId});
    res.status(201).json({
        status: 'success',
        player: newFixture
    });
});

exports.getFixtureForTeam = catchAsyncError(async (req, res, next) => {
    const fixtures = await Fixture.find(
        { 
            $or: 
            [ 
                { homeTeam: req.params.teamId }, 
                { awayTeam: req.params.teamId} 
            ] 
        }).select('-__v').explain;
    res.status(200).json({
        status: 'success',
        fixtures
    });
});