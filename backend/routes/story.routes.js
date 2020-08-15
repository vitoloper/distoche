module.exports = (app) => {
  const stories = require('../controllers/story.controller');

  app.get('/api/stories/:id', stories.getOne);  // Get one story
}