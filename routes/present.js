const express = require('express');
const router = express.Router();

MeterRead = require('../models/meter-read.js');

// present a meter read from the database.
router.get('/', (req, res) => {
  const queryVariables = {};
  const {
    customerId,
    serialNumber,
  } = req.query;

  if(!customerId && !serialNumber) {
    return res.json({error: "Please provide a customer ID or serial number."});
  };

  if(customerId) {
    queryVariables.customerId = customerId;
  };
  if(serialNumber) {
    queryVariables.serialNumber = serialNumber;
  };

  MeterRead.find(queryVariables, (err, response) => {
    if(err) {
      console.log("Something went wrong: ", err);
      res.json({error: err})
    };
    console.log(response);
    res.json({payload: response});
  });
});

module.exports = router;
