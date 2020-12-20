/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const routes = require('../api/routes');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});

// middle wares
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  })
})

app.use('/api/routes', routes);
// Got error and
// identifined not found what the request was
app.use(middlewares.NotFound)

// Showed specific an error
app.use(middlewares.ErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
