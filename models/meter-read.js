const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meterReadSchema = new Schema({
  customerId: String,
  serialNumber: Number,
  mpxn: Number,
  read: [{type: String, registerId: Number, value: Number}],
  readDate: Date,
});

const MeterRead = mongoose.model('MeterRead', meterReadSchema);

module.exports = MeterRead;
