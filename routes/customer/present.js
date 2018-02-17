const express = require('express');
const router = express.Router();

Customer = require('../../models/customer.js');

router.get('/', (req, res) => {
  const { customerId } = req.query;

  if(!customerId) {
    return res.json({error: "Please provide a customer ID."});
  };

  Customer.findOne({customerId}, (err, response) => {
    if(err) {
      console.log("Something went wrong: ", err);
      res.json({error: err})
    };
    console.log(response);
    res.json({payload: response});
  });
});

module.exports = router;
