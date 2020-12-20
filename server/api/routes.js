/* eslint-disable */ 

const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Global',
  });
});

module.exports = router;
