/* eslint-disable */ 

const { Router } = require('express');
const { findById } = require('../src/models/logEntry');

const LogEntry = require('../src/models/logEntry');

const router = Router();

router.get('/', async (req, res, next) => {
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

router.delete('/:id', async(req, res, next) => {
  try {
    await LogEntry.findByIdAndDelete(req.params.id);
    const logEntry = new LogEntry(req.body);
    res.json(logEntry);
  } catch (error) {
    next(error);
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const updatedEntry = 
    await LogEntry.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
