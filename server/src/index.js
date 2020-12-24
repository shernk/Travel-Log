/* eslint-disable */

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
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// process.on('unhandledRejection', (reason, promise) => {
//   console.log('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// middle wares
app.use(morgan('common'));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

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

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
