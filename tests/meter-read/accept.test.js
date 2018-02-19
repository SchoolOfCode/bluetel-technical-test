const test = require('ava');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app.js');
const config = require('../../config/config-test.js');

test.before('Routing', t => {
  mongoose.connect(`${config.dbProtocol}${config.dbUser}:${config.dbPass}@${config.dbHost}:${config.dbPort}/${config.dbName}`);
});

// If the route is able to create a new entry in the meterreads collection, return the meter-read details.
test.cb('meter-read-accept-correct', t => {
  request(app)
    .post('/meter-read/accept')
    .send({
      customerId: "thisIdAlsoExists",
      serialNumber: 'thisSerialNumberExists',
      mpxn: "2346789",
      read: [
        {readType: "ANYTIME", registerId: "387373", value: "2729"},
        {readType: "NIGHT", registerId: "387373", value: "2892"}
      ],
      readDate: "2017-11-20T16:19:48.000Z"
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.payload.serialNumber, "thisSerialNumberExists");
      t.is(res.body.payload.customer, "5a8ae9dbb800da0c3cb402c6");
      t.end();
    });
});

// If the route receives an incorrect customerId, return an error.
test.cb('meter-read-accept-no-id', t => {
  request(app)
    .post('/meter-read/accept')
    .send({
      serialNumber: 'thisSerialNumberExists',
      mpxn: "2346789",
      read: [
        {readType: "ANYTIME", registerId: "387373", value: "2729"},
        {readType: "NIGHT", registerId: "387373", value: "2892"}
      ],
      readDate: "2017-11-20T16:19:48.000Z"
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error, "No such customer in database.");
      t.end();
    });
});

// If the route does not receive any required form data, return an error.
test.cb('meter-read-accept-no-serial-number', t => {
  request(app)
    .post('/meter-read/accept')
    .send({
      customerId: "thisIdExists",
      read: [
        {readType: "ANYTIME", registerId: "387373", value: "2729"},
        {readType: "NIGHT", registerId: "387373", value: "2892"}
      ],
      readDate: "2017-11-20T16:19:48.000Z"
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error.message, "MeterRead validation failed: serialNumber: Path `serialNumber` is required., mpxn: Path `mpxn` is required.");
      t.end();
    });
});
