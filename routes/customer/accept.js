const express = require('express');
const router = express.Router();

Customer = require('../../models/customer.js');

router.post('/', (req, res) => {
  const newCustomer = new Customer(req.body);
  newCustomer.save((err, response) => {
    if(err) {
      console.log("Something went wrong:", err);
      res.json({error:err});
      return
    };
    console.log(response);
    res.json({payload:response});
  });
})

module.exports = router;
