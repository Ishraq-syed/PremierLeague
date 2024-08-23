const globalErrorHandler = (err, req, res, next) => {
    err.status = err.status || 500;
    err.statusCode = err.statusCode || 'error';
    res.status(err.status).json({
        status: 'fail',
        message: err.message
    })
}

module.exports = globalErrorHandler;