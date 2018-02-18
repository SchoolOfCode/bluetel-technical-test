import test from 'ava';
import request from 'supertest';

import app from './app.js';

///// CUSTOMER/PRESENT /////

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

///// CUSTOMER/ACCEPT /////

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

///// METER-READ/PRESENT /////

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

///// METER-READ/ACCEPT /////

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
      t.is(res.body.payload.customer, "5a89eb2a05ff180acc02d60c");
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
