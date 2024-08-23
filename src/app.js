const express = require('express');
const globalErrorHandler = require('./controllers/error-controller');
const app = express();
const seasonRouter = require('./routes/season-routes');

app.use(express.json());

app.use('/api/v1/seasons', seasonRouter);
app.use(globalErrorHandler);

module.exports = app;