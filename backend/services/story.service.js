const StoryModel = require('../models/story.model');
const Role = require('../_helpers/role');

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

/**
 * Update storia
 * 
 * @param {*} id 
 * @param {*} story 
 * @param {*} result 
 * 
 */
exports.updateStory = (id, story, result) => {
  story.modified_at = new Date();

  StoryModel.update(id, story, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, story);
  });
}

/**
 * Salva una nuova storia
 * 
 * @param {} story 
 * @param {*} result 
 */
exports.createStory = (user, story, result) => {
  story.owner = user.sub;

  if (user.role === Role.fruitore) {
    story.approved_at = null;
    story.approved = false;
    story.approved_by = null;
  } else if (user.role === Role.esperto) {
    story.approved_at = new Date();
    story.approved = true;
    story.approved_by = user.sub;
  } else {
    return result({ message: 'invalid role' }, null);
  }

  StoryModel.create(story, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}
