module.exports = (app) => {
  const assets = require('../controllers/asset.controller');
  const stories = require('../controllers/story.controller');

  app.get('/api/assets', assets.get);   // Get cultural assets
  app.get('/api/assets/:id', assets.getOne);  // Get one cultural asset (detail)
  app.get('/api/assets/:id/stories', stories.getAssetStories);  // Get stories associated with asset
}
