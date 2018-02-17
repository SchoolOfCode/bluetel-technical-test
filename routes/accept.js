var express = require('express');
var router = express.Router();

MeterRead = require('../models/meter-read.js');

// save a meter read to the database.
router.post('/', (req, res) => {
  var newMeterRead = new MeterRead(req.body);
  console.log(newMeterRead);
  newMeterRead.save((err, response) => {
    if(err) {
      console.log("Something went wrong: ", err);
      res.json({error:err});
    };
    console.log(response);
    res.json({payload:response});
  });
});

module.exports = router;
