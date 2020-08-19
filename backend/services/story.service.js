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

/**
 * GET dettaglio storia
 * 
 * @param {*} id 
 * @param {*} result
 * 
 */
exports.getOne = (id, result) => {
  StoryModel.getOne(id, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}

/**
 * GET storie utente specifico
 * 
 * @param {*} userId 
 * @param {*} options 
 * @param {*} result 
 * 
 */
exports.getUserStories = (userId, options, result) => {
  StoryModel.getUserStories(userId, options, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}
