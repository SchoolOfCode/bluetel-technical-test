const express = require('express');
const router = express.Router();

const Customer = require('../../models/customer.js');

router.post('/', (req, res) => {
  const newCustomer = new Customer(req.body);
  newCustomer.save((err, response) => {
    if(err) {
      console.error("Something went wrong:", err);
      return res.json({error:err});
    };
    console.log(response);
    res.json({payload:response});
  });
})

module.exports = router;
