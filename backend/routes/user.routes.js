const authorize = require('../_helpers/authorize');

module.exports = (app) => {
  const user = require('../controllers/user.controller');

  app.post('/api/authenticate', user.authenticate);   // Authenticate an user
  app.post('/api/signup', user.signup);   // User signup
  app.get('/api/testauth', authorize(), user.testauth);    // Test authentication (all roles)
  app.get('/api/user/me', authorize(), user.getMyUser); // Get user information
  app.put('/api/user/me', authorize(), user.updateMyUser);  // Update user profile
};
