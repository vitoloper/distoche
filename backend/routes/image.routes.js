module.exports = (app) => {
  const images = require('../controllers/image.controller');

  app.get('/api/images/:filename', images.getOne);   // Get uploaded image
}
