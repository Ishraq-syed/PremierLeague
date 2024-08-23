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