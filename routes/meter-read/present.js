const express = require('express');
const router = express.Router();

const MeterRead = require('../../models/meter-read.js');
const Customer = require('../../models/customer.js');

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
        console.log("Something went wrong:", err);
        return res.json({error:err});
      };
      queryVariables.customer = customer;
    });
  };

  MeterRead.find(queryVariables)
  .populate('customer')
  .exec((err, response) => {
    if(err) {
      console.log("Something went wrong: ", err);
      res.json({error: err})
    };
    console.log(response);
    res.json({payload: response});
  });
});

module.exports = router;
