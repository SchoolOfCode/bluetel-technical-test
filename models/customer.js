const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  customerId: {type: String, required: true, unique: true},
  name: {type: String, required: true},
});

customerSchema.plugin(uniqueValidator);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
