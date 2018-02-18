const express = require('express');
const router = express.Router();

const Customer = require('../../models/customer.js');

router.get('/', (req, res) => {
  const { customerId } = req.query;

  if(!customerId) {
    return res.json({error: "Please provide a customer ID."});
  };

  Customer.findOne({customerId}, (err, response) => {
    if(err) {
      console.error("Something went wrong: ", err);
      res.json({error: err})
    };
    console.log("customer:", response);
    if(!response) {
      console.error("Error: no such customer in database.")
      return res.json({error: "No such customer in database."})
    }
    res.json({payload: response});
  });
});

module.exports = router;
