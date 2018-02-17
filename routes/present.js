const express = require('express');
const router = express.Router();

MeterRead = require('../models/meter-read.js');

// present a meter read from the database.
router.get('/', (req, res) => {
  MeterRead.find((err, response) => {
    if(err) {
      console.log("Something went wrong: ", err);
      res.json({error: err})
    };
    console.log(response);
    res.json({payload: response});
  });
});

module.exports = router;
