const StoryModel = require('../models/story.model');
const Role = require('../_helpers/role');

/**
 * Servizio GET storie associate a bene culturale
 * 
 * @param {*} user - utente (se loggato)
 * @param {*} id - id bene culturale
 * @param {*} options
 * @param {*} result 
 * 
 * Utente 'esperto' vede:
 * - le proprie storie (visibili e non visibili)
 * - le storie degli altri utenti 'fruitori' ed 'esperti' (approvate/non-approvate e visibili)
 * 
 * Utente 'fruitore' vede:
 *  - le proprie storie (visibili e non visibili, approvate e non approvate)
 *  - le storie degli altri utenti (approvate e visibili)
 */
exports.getAssetStories = (user, id, options, result) => {
  if (user && user.role === Role.esperto) {
    StoryModel.getAssetStoriesEsperto(user.sub, id, options, (err, data) => {
      if (err) {
        return result(err, null);
      }

      return result(null, data);
    });
  } else if (user && user.role === Role.fruitore) {
    StoryModel.getAssetStoriesFruitore(user.sub, id, options, (err, data) => {
      if (err) {
        return result(err, null);
      }

      return result(null, data);
    });
  } else {
    StoryModel.getAssetStories(id, options, (err, data) => {
      if (err) {
        return result(err, null);
      }

      return result(null, data);
    });
  }
}

/**
 * GET dettaglio storia
 * 
 * @param {*} user - utente (se loggato)
 * @param {*} id 
 * @param {*} result
 * 
 * Utente 'esperto' vede:
 * - la mia storia (visibili e non visibili)
 * - le storie degli altri utenti 'fruitori' ed 'esperti' (approvate/non-approvate e visibili)
 * 
 * Utente 'fruitore' vede:
 *  - la mia storia (visibile e non visibile, approvata e non approvata)
 *  - la storia di altri utenti (approvata e visibile)
 * 
 * Utente pubblico vede:
 * - le storie visibili e approvate
 * 
 */
exports.getOne = (user, id, result) => {
  if (user && user.role === Role.fruitore) {
    StoryModel.getOneFruitore(user.sub, id, (err, data) => {
      if (err) {
        return result(err, null);
      }

      return result(null, data);
    });
  } else if (user && user.role === Role.esperto) {
    StoryModel.getOneEsperto(user.sub, id, (err, data) => {
      if (err) {
        return result(err, null);
      }

      return result(null, data);
    });
  } else {
    StoryModel.getOne(id, (err, data) => {
      if (err) {
        return result(err, null);
      }

      return result(null, data);
    });
  }
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

  // Fruitore: non approvata
  // Esperto: approvata automaticamente
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

/**
 * Elimina una storia
 * 
 * @param {*} user 
 * @param {*} id 
 * @param {*} result 
 */
exports.deleteStory = (user, id, result) => {

  StoryModel.delete(user.sub, id, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}

/**
 * Approva storia
 * @param {*} id 
 * @param {*} result 
 * 
 */
exports.approveStory = (approver, id, result) => {
  StoryModel.approve(approver.sub, id, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}