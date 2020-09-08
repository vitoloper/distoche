/**
 * Story routes test suites.
 * 
 */

const request = require('supertest');
const app = require('../server');

describe('GET /api/stories/1', function () {
  it('responds with a story', function (done) {
    request(app)
      .get('/api/assets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /api/user/stories', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'e1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  it('responds with a list of stories for an authenticated user', function (done) {
    request(app)
      .get('/api/user/stories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /api/stories/1/approve', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'e1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  it('responds with approved OK', function (done) {
    request(app)
      .put('/api/stories/1/approve')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Authenticate, create new story
describe('POST /api/stories', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'e1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  // Create a new story
  it('responds with the new story', function (done) {
    story = {
      titolo: 'mock story',
      descr: 'mock descr',
      contenuto: '<p>mock content</p>',
      approved: 1,
      visible: 0,
      id_bene: 1,
      owner: 2,
      approved_by: 2
    };

    request(app)
      .post('/api/stories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(story)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Authenticate, get a story, update an existing story
describe('PUT /api/stories', function () {
  var token = null;

  // Authenticate the user before performing the next test in this test suite
  before(function (done) {
    request(app)
      .post('/api/authenticate')
      .send({ username: 'e1', password: 'distoche' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  var story = null;

  // Get a story
  before(function (done) {
    request(app)
      .get('/api/stories/1')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        story = res.body[0];
        done();
      });
  });

  // Update an existing story
  it('responds with the updated story', function (done) {
    story.descr = 'updated descr';

    request(app)
      .put('/api/stories/' + story.id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(story)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Authenticate, create a story, delete a story
describe('DELETE /api/stories/:id', function () {
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

  var new_story_id;

  // Create a new story
  before(function (done) {
    story = {
      titolo: 'mock story',
      descr: 'mock descr',
      contenuto: '<p>mock content</p>',
      approved: 1,
      visible: 0,
      id_bene: 1,
      owner: 2,
      approved_by: 2
    };

    request(app)
      .post('/api/stories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(story)
      .end(function (err, res) {
        new_story_id = res.body.id;
        done();
      });
  });

  // Delete a story
  it('responds DELETE OK', function (done) {

    request(app)
      .delete('/api/stories/' + new_story_id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
