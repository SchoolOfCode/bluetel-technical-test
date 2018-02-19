const test = require('ava');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app.js');
const config = require('../../config/config-test.js');

test.before('Routing', t => {
  mongoose.connect(`${config.dbProtocol}${config.dbUser}:${config.dbPass}@${config.dbHost}:${config.dbPort}/${config.dbName}`);
});

// If no parameters are handed to the route, return an error.
test.cb('customer-present-no-parameters', t => {
  request(app)
    .get('/customer/present')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error, "Please provide a customer ID.");
      t.end();
    });
});

// If the route cannot find an entry with the given customerId, return an error.
test.cb('customer-present-no-such-customer', t => {
  request(app)
    .get('/customer/present?customerId=thisIdIsFalse')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error, "No such customer in database.");
      t.end();
    });
});

// If the route is able to find an entry with the given customerId, return the customer details.
test.cb('customer-present-correct', t => {
  request(app)
    .get('/customer/present?customerId=thisIdExists')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.payload.name, "this is an example customer name");
      t.end();
    });
});
