/* eslint-disable linebreak-style */
/* eslint-disable semi */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const middlewares = require('./middlewares');

const app = express();

// middle wares
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

// Got error and
// identifined not found what the request was
app.use(middlewares.NotFound)

// Showed specific an error
app.use(middlewares.ErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
