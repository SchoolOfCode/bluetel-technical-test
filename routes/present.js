var express = require('express');
var router = express.Router();

// present a meter read from the database.
router.get('/', (req, res, next) => {
  res.send('heres a thing');
});

module.exports = router;
