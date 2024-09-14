const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../util/error');
const User = require('../models/user-modal');
const authService = require('../services/auth-service');
const catchAsyncError = require('../util/async-error-handler');

const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE_TIME * 60* 60 * 1000))
}

exports.signUp = catchAsyncError(async (req, res, next) => {
   const user = await User.create(req.body);
   const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME
   });
   res.cookie('jwt', token, cookieOptions);
   res.status(201).json({
    status: 'Success!',
    token
   })
});

exports.login = catchAsyncError(async (req, res, next) => {
  // check if username and password exist in request
  if (!req.body.email || !req.body.password) {
      return next(new AppError('Username and Password are required', 400));
  }

  const user = await User.findOne({email: req.body.email}).select('+password');
  const isPasswordValid = await authService.comparePasswords(req.body.password, user.password);

  // Two checks here. First check if user exists and then check password is valid
  if (!user || !isPasswordValid) {
   return next(new AppError('Email or password is incorrect', 400));
  }
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
   expiresIn: process.env.JWT_EXPIRE_TIME
  });
  res.cookie('jwt', token, cookieOptions);
  res.status(200).json({
   status: 'Success!',
   token
  });
});

exports.protect = catchAsyncError(async (req, res, next) => {
  // Check if JWT exists
   let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new AppError('Auth Token Not Found', 401))
    }

    // Check if JWT is valid
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user who issued JWT exists
    const user = await User.findById(decodedInfo.id);

    if (!user) {
      return next(new AppError('The User who issued the token does not exist anymore!'))
    }

    req.user = user;

    next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles, req.user)
    if (roles.indexOf(req.user.role) === -1) {
      return next(new AppError('This user does not have permission to access the route', 401))
    }
    next();
  }
};


