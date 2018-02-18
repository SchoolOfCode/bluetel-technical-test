const express = require('express');
const router = express.Router();

const MeterRead = require('../../models/meter-read.js');
const Customer = require('../../models/customer.js');

const findMeterReads = (parameters, res) => {
  console.log("Search Parameters:", parameters)
  MeterRead.find(parameters)
  .populate('customer')
  .exec((err, response) => {
    if(err) {
      console.error("Something went wrong: ", err);
      return res.json({error: err})
    };
    console.log("Response:", response);
    if(response.length === 0) {
      console.error("Error: no entries could be found.");
      return res.json({error: "No entries could be found."});
    };
    res.json({payload: response});
  });
};

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

  if(serialNumber) {
    queryVariables.serialNumber = serialNumber;
  };

  if(customerId) {
    Customer.findOne({customerId}, (err, customer) => {
      if(err) {
        console.error("Something went wrong:", err);
        return res.json({error:err});
      };
      queryVariables.customer = customer;
      if(!customer) {
        console.error("Error: no such customer in database.");
        return res.json({error: "No such customer in database."});
      };
      return findMeterReads(queryVariables, res);
    });
  } else {
    return findMeterReads(queryVariables, res);
  };
});

module.exports = router;
