const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// All fields are set to validate as strings as this is what was given in the example, except for readDate.
// 'type' is a reserved word in mongoose, so I have changed it to 'readType'.
// JSON for readDate has been modified to be a date format that can be read by JavaScript.

const meterReadSchema = new Schema({
  customer: {type: Schema.Types.ObjectId, ref: 'Customer', required: true},
  serialNumber: {type: String, required: true},
  mpxn: {type: String, required: true},
  read: {type:[{readType: {type: String, required: true}, registerId: {type: String, required: true}, value: {type: String, required: true}}], required: true},
  readDate: {type: Date, required: true}
});

const MeterRead = mongoose.model('MeterRead', meterReadSchema);

module.exports = MeterRead;
