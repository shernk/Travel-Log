/* eslint-disable linebreak-style */
/* eslint-disable semi */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// middle ware
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:9000',
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  })
})

// Get error from url
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  // direct to error
  next(error);
})

// Show an error
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'NOT FOUND NODE_ENV' : error.stack,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
