var express = require('express');
var router = express.Router();

// save a meter read to the database.
router.post('/', (req, res, next) => {
  res.json({payload: 'something'});
});

module.exports = router;
