const Season = require('../models/season-model');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');

exports.addNewSeason =  catchAsyncError(async (req, res, next) => {
    const newSeason = await Season.create(req.body);
    res.status(201).json({
        status: 'success',
        newSeason
    });
});

exports.getAllSeasons =  catchAsyncError(async (req, res, next) => {
    const seasons = await Season.find().select('-__v');
    res.status(200).json({
        status: 'success',
        total: seasons.length,
        data: seasons
    });
});

exports.getOneSeason =  catchAsyncError(async (req, res, next) => {
    const season = await Season.findById(req.params.seasonId).select('-__v');;
    res.status(200).json({
        status: 'success',
        season
    });
});

exports.deleteSeason =  catchAsyncError(async (req, res, next) => {
    await Season.findByIdAndDelete(req.params.seasonId);
    res.status(204).json(null);
});

exports.updateSeason =  catchAsyncError(async (req, res, next) => {
    const updatedSeason = await Season.findByIdAndUpdate(req.params.seasonId, req.body, {
        runValidators: true,
        new: true // returns updated doc
    }).select('-__v');;
    res.status(200).json({
        status: 'success',
        updatedSeason
    });
});