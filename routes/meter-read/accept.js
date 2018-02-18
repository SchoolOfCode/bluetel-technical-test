const express = require('express');
const router = express.Router();

const MeterRead = require('../../models/meter-read.js');
const Customer = require('../../models/customer.js');

// save a meter read to the database.
router.post('/', (req, res) => {

  const {
    customerId,
    serialNumber,
    mpxn,
    read,
    readDate,
  } = req.body;

  Customer.findOne({customerId}, (err, customer) => {
    if(err) {
      console.error("Something went wrong:", err);
      return res.json({error:err});
    };
    console.log("customer:", customer);
    if(!customer) {
      console.error("Error: No such customer in database.");
      return res.json({error: "No such customer in database."});
    };

    const newMeterRead = new MeterRead({customer: customer._id, serialNumber, mpxn, read, readDate});
    newMeterRead.save((err, response) => {
      if(err) {
        console.log("Something went wrong:", err);
        return res.json({error:err});
      };
      console.log(response);
      res.json({payload:response});
    });
  });
});

module.exports = router;
