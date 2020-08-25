const jwt = require('express-jwt');
const authorize = require('../_helpers/authorize');
const stories = require('../controllers/story.controller');

const { secret } = require('../config/jwt.config.json');

module.exports = (app) => {

  app.get('/api/stories/:id',
    jwt({ secret, algorithms: ['HS256'], credentialsRequired: false }),
    stories.getOne);  // Get one story
  app.get('/api/user/stories', authorize(), stories.getUserStories);  // Get user stories
  app.post('/api/stories', authorize(), stories.createStory); // Create a new story
  app.put('/api/stories/:id', authorize(), stories.updateStory);  // Update story
  app.delete('/api/stories/:id', authorize(), stories.deleteStory); // Create a new story
}
