const Fixture = require('../models/user-modal');
const AppError = require('../util/error');
const catchAsyncError = require('../util/async-error-handler');
const User = require('../models/user-modal');

exports.updateUser =  catchAsyncError(async (req, res, next) => {
    const validValuesToUpdate = ['firstName', 'lastName', 'email'];
    const fileteredReqBody = {};
    for (obj in req.body) {
        if (validValuesToUpdate.indexOf(obj) > -1) {
            fileteredReqBody[obj] = req.body[obj];
        } 
    }
    const user = await User.findByIdAndUpdate(req.user.id, fileteredReqBody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        user
    });
});
