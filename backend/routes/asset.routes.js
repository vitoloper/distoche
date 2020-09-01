const jwt = require('express-jwt');
const authorize = require('../_helpers/authorize');
const assets = require('../controllers/asset.controller');
const stories = require('../controllers/story.controller');
const Role = require('../_helpers/role');

const { secret } = require('../config/jwt.config.json');

module.exports = (app) => {

  app.get('/api/assets', assets.get);   // Get cultural assets
  app.get('/api/assets/:id', assets.getOne);  // Get one cultural asset (detail)
  app.get('/api/assets/:id/stories',
    jwt({ secret, algorithms: ['HS256'], credentialsRequired: false }),
    stories.getAssetStories);  // Get stories associated with asset (identify registered users while still providing access to unregistered users)
  app.get('/api/user/assets', authorize([Role.gestore]), assets.getUserAssets); // Get user assets
  app.put('/api/assets/:id', authorize([Role.gestore]), assets.updateAsset);  // Update asset
  app.post('/api/assets', authorize([Role.gestore]), assets.createAsset); // Create asset
  app.delete('/api/assets/:id', authorize([Role.gestore]), assets.deleteAsset); // Delete asset
}
