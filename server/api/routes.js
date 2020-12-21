/* eslint-disable */ 

const { Router } = require('express');

const LogEntry = require('../src/models/logEntry');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if(error.name === 'ValidationError'){
      res.status(422);
    }

    next(error);
  }
});

//TODO: create route for delete and update
// ... code here

module.exports = router;
