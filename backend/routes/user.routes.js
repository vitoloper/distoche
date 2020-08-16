const authorize = require('../_helpers/authorize');

module.exports = (app) => {
  const user = require('../controllers/user.controller');

  app.post('/api/authenticate', user.authenticate);   // Authenticate an user
  app.get('/api/testauth', authorize(), user.testauth);    // Test authentication (all roles)
};
