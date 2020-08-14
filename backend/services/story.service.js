const StoryModel = require('../models/story.model');

/**
 * Servizio GET storie associate a bene culturale
 * 
 * @param {*} id - id bene culturale
 * @param {*} options
 * @param {*} result 
 * 
 */
exports.getAssetStories = (id, options, result) => {
  StoryModel.getAssetStories(id, options, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}
