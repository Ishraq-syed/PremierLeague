const express = require('express');
const globalErrorHandler = require('./controllers/error-controller');
const app = express();
const seasonRouter = require('./routes/season-routes');
const AppError = require('./util/error');

app.use(express.json());

app.use('/api/v1/seasons', seasonRouter);
app.all('*', (request, response, next) => {
    next(new AppError('Resource not Found!!!', 404));
});

app.use(globalErrorHandler);

module.exports = app;