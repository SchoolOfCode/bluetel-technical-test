const test = require('ava');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app.js');
const config = require('../../config/config-test.js');

test.before('Routing', t => {
  mongoose.connect(`${config.dbProtocol}${config.dbUser}:${config.dbPass}@${config.dbHost}:${config.dbPort}/${config.dbName}`);
});

// If the route is able to create a new entry in the customers collection, return the customer details.
// This test will not necessarily always create a unique id, but it is very unlikely to create a duplicate.
test.cb('customer-accept-correct', t => {
  let uniqueId = Math.random() + "";
  request(app)
    .post('/customer/accept')
    .send({customerId: uniqueId, name: 'this is a new customer'})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.payload.name, "this is a new customer");
      t.is(res.body.payload.customerId, uniqueId);
      t.end();
    });
});

// If the route finds an entry with a duplicate customerId, return an error.
test.cb('customer-accept-duplicate', t => {
  request(app)
    .post('/customer/accept')
    .send({customerId: 'thisIdExists', name: 'this customer already exists'})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error.message, "Customer validation failed: customerId: Error, expected `customerId` to be unique. Value: `thisIdExists`");
      t.end();
    });
});

// If the route does not receive a customerId, return an error.
test.cb('customer-accept-no-id', t => {
  request(app)
    .post('/customer/accept')
    .send({name: 'this customer has no id'})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error.message, "Customer validation failed: customerId: Path `customerId` is required.");
      t.end();
    });
});

// If the route does not receive a name, return an error.
test.cb('customer-accept-no-name', t => {
  request(app)
    .post('/customer/accept')
    .send({customerId: 'noCustomerName'})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.is(res.body.error.message, "Customer validation failed: name: Path `name` is required.");
      t.end();
    });
});
