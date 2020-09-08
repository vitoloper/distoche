/**
 * User routes test suites.
 * 
 */

const request = require('supertest');
const app = require('../server');

// Authenticate
describe('POST /api/authenticate', function () {
  it('responds with auth success', function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'f1', password: 'distoche' })
      .expect(200, done);
  });
});

// Signup
describe('POST /api/signup', function () {
  it('responds with registration successful', function (done) {
    request(app)
      .post('/api/signup')
      .set('Accept', 'application/json')
      .send({ username: 'newuser' + Date.now(), email: Date.now() + 'testmail@local.me', password: 'mockpwd' })
      .expect(200, done);
  });
});

// Get user info
describe('GET /api/user/me', function () {
  // Authenticate first
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'e1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token;
        done();
      });
  });

  it('responds with user profile info', function (done) {
    request(app)
      .get('/api/user/me')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Update user info
describe('PUT /api/user/me', function () {
  // Authenticate first
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'e1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token;
        done();
      });
  });

  var user = null;
  // Get user info before update
  before(function (done) {
    request(app)
      .get('/api/user/me')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        user = res.body[0];
        done();
      });
  });

  it('responds with update OK', function (done) {
    user.citta_residenza =' Mock city';
    request(app)
      .put('/api/user/me')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});