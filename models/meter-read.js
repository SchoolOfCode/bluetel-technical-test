const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meterReadSchema = new Schema({
  customerId: String,
  serialNumber: String,
  mpxn: String,
  read: [{type: String, registerId: String, value: String}],
  readDate: Date,
});

const MeterRead = mongoose.model('MeterRead', meterReadSchema);

module.exports = MeterRead;
