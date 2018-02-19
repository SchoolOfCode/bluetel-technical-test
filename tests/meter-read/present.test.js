const test = require('ava');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app.js');
const config = require('../../config/config-test.js');

test.before('Routing', t => {
  mongoose.connect(`${config.dbProtocol}${config.dbUser}:${config.dbPass}@${config.dbHost}:${config.dbPort}/${config.dbName}`);
});

// If no parameters are handed to the route, return an error.
test.cb('meter-read-present-no-parameters', t => {
  request(app)
    .get('/meter-read/present')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error, "Please provide a customer ID or serial number.");
      t.end();
    });
});

// If the route cannot find a given customerId, return an error.
test.cb('meter-read-present-no-such-customer', t => {
  request(app)
    .get('/meter-read/present?customerId=thisIdIsFalse')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error, "No such customer in database.");
      t.end();
    });
});

// If the route cannot find any entries with a given customerId, return an error.
test.cb('meter-read-present-no-entries', t => {
  request(app)
    .get('/meter-read/present?customerId=thisIdHasNoEntries')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error, "No entries could be found.");
      t.end();
    });
});

// If the route is able to find any entries with the given customerId, return the meter-read details for the first entry.
test.cb('meter-read-present-correct-customer-id', t => {
  request(app)
    .get('/meter-read/present?customerId=thisIdExists')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.payload[0].readDate, "2017-11-20T16:19:48.000Z");
      t.is(res.body.payload[0].mpxn, "2346789");
      t.end();
    });
});

// If the route is able to find any entries with the given serialNumber, return the meter-read details for the first entry.
test.cb('meter-read-present-correct-serial-number', t => {
  request(app)
    .get('/meter-read/present?serialNumber=thisSerialNumberExists')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.payload[0].readDate, "2017-11-20T16:19:48.000Z");
      t.is(res.body.payload[0].mpxn, "2346789");
      t.end();
    });
});

// If the route is able to find any entries with the given customerId and serialNumber, return the meter-read details.
test.cb('meter-read-present-correct-both', t => {
  request(app)
    .get('/meter-read/present?customerId=thisIdExists&serialNumber=thisSerialNumberExists')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.payload[0].readDate, "2017-11-20T16:19:48.000Z");
      t.is(res.body.payload[0].mpxn, "2346789");
      t.end();
    });
});
