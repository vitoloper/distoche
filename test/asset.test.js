/**
 * Asset routes test suites.
 * 
 */

const request = require('supertest');
const app = require('../server');

describe('GET /api/assets', function () {
  it('responds with json containing a list of visible cultural assets', function (done) {
    request(app)
      .get('/api/assets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /api/assets/1', function () {
  it('responds with json containing the cultural asset with id=1', function (done) {
    request(app)
      .get('/api/assets/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /api/assets/1/stories', function () {
  it('responds with json containing a list of visible and approved stories for asset with id=1', function (done) {
    request(app)
      .get('/api/assets/1/stories')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /api/user/assets', function () {
  it('responds with unauthorized', function (done) {
    request(app)
      .get('/api/user/assets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'g1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  it('responds with a list of cultural assets (authenticated user "amministratore")', function (done) {
    request(app)
      .get('/api/user/assets')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Authenticate, get the asset, update the asset
describe('PUT /api/user/assets/1', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'g1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  var asset = null;

  // Get an existing cultural asset
  before(function (done) {
    request(app)
      .get('/api/assets/1')
      .end(function (err, res) {
        asset = res.body[0];
        done();
      });
  });

  // Update cultural asset description
  it('responds with the updated asset information', function (done) {
    asset.descr = 'changed description';

    request(app)
      .put('/api/assets/1')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(asset)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Authenticate, create new cultural asset
describe('PUT /api/assets', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'g1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  // Create a new cultural asset
  it('responds with the new cultural asset', function (done) {
    asset = {
      nome: 'mock asset',
      lat: 40.00,
      lon: 35.00,
      owner: 1,  // owner is g1
      visible: 0
    };

    request(app)
      .post('/api/assets')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(asset)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Authenticate, create new cultural asset, delete the asset
describe('DELETE /api/assets/:id', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'g1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  var new_asset_id = 10000;

  // Create a new cultural asset
  before(function (done) {
    asset = {
      nome: 'mock asset',
      lat: 40.00,
      lon: 35.00,
      owner: 1,  // owner is g1
      visible: 0
    };

    request(app)
      .post('/api/assets')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(asset)
      .end(function (err, res) {
        new_asset_id = res.body.id;
        done();
      });
  });

  // Delete the cultural asset
  it('responds with OK 200 deletion successful', function (done) {
    request(app)
      .delete('/api/assets/'+new_asset_id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(asset)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });


});
