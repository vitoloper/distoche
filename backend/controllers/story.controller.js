const StoryService = require('../services/story.service');
const Story = require('../models/story.model');

exports.getAssetStories = (req, res) => {
  options = {
    orderby: null,
    direction: null,
    limit: null,
    offset: null,
    titlequery: null
  };

  var id = req.params.id; // cultural asset id
  var orderby = req.query.orderby;
  var direction = req.query.direction;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var titlequery = req.query.titlequery;

  // ordering options
  if (orderby) options.orderby = orderby;
  if (direction) options.direction = direction;

  // "limit" and "offset" must be used together
  if ((limit && !offset) || (!limit && offset)) {
    return res.status(400).json({ message: 'LIMIT and OFFSET parameters must be used together' });
  }

  // Both "limit" and "offset" used, check and convert
  if (limit && offset) {
    if (isNaN(limit))
      return res.status(400).json({ message: 'Invalid LIMIT parameter' });

    if (isNaN(offset))
      return res.status(400).json({ message: 'Invalid OFFSET parameter' });

    // Convert parameters to integers
    options.limit = parseInt(limit);
    options.offset = parseInt(offset);
  }

  // Search query string in story title
  if (titlequery) options.titlequery = titlequery;

  if (!id) {
    return res.status(400).json({ message: 'id required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Parse cultural asset id
  id = parseInt(id);

  StoryService.getAssetStories(id, options, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error retrieving stories' });
    }

    return res.json(data);
  });
}

exports.getOne = (req, res) => {
  var id = req.params.id; // story id

  if (!id) {
    return res.status(400).json({ message: 'id required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Parse story id
  id = parseInt(id);

  StoryService.getOne(id, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error retrieving story' });
    }

    return res.json(data);
  });
}

/**
 * Ottieni storie di un utente specifico
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getUserStories = (req, res) => {
  // req.user.sub - userid
  // req.user.role - user role ('fruitore', 'esperto', ...)
  options = {
    orderby: null,
    direction: null,
    limit: null,
    offset: null,
    titlequery: null
  };

  var userId = req.user.sub; // user id
  var orderby = req.query.orderby;
  var direction = req.query.direction;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var titlequery = req.query.titlequery;

  // ordering options
  if (orderby) options.orderby = orderby;
  if (direction) options.direction = direction;

  // "limit" and "offset" must be used together
  if ((limit && !offset) || (!limit && offset)) {
    return res.status(400).json({ message: 'LIMIT and OFFSET parameters must be used together' });
  }

  // Both "limit" and "offset" used, check and convert
  if (limit && offset) {
    if (isNaN(limit))
      return res.status(400).json({ message: 'Invalid LIMIT parameter' });

    if (isNaN(offset))
      return res.status(400).json({ message: 'Invalid OFFSET parameter' });

    // Convert parameters to integers
    options.limit = parseInt(limit);
    options.offset = parseInt(offset);
  }

  // Search query string in story title
  if (titlequery) options.titlequery = titlequery;

  // Parse cultural asset id
  userId = parseInt(userId);

  StoryService.getUserStories(userId, options, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error retrieving stories' });
    }

    return res.json(data);
  });
}

exports.updateStory = (req, res) => {
  var id = req.params.id;
  var story = req.body;

  if (!id) {
    return res.status(400).json({ message: 'id required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Parse story id
  id = parseInt(id);

  StoryService.updateStory(id, story, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error saving story'});
    }

    return res.json(data);
  });
}
