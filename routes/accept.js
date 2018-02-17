const express = require('express');
const router = express.Router();

MeterRead = require('../models/meter-read.js');

// save a meter read to the database.
router.post('/', (req, res) => {
  var newMeterRead = new MeterRead(req.body);
  newMeterRead.save((err, response) => {
    if(err) {
      console.log("Something went wrong:", err);
      res.json({error:err});
      return
    };
    console.log(response);
    res.json({payload:response});
  });
});

module.exports = router;
