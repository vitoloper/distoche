module.exports = (app) => {
  const assets = require('../controllers/asset.controller');

  app.get('/api/assets', assets.get);   // Get cultural assets
}
