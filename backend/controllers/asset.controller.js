const AssetModel = require('../models/asset.model');
const AssetService = require('../services/asset.service');
const Asset = require('../models/asset.model');

/**
 * GET beni culturali (cultural assets)
 * 
 * @param {*} req 
 * @param {*} res
 * 
 */
exports.get = (req, res) => {
  options = {
    orderby: null,
    direction: null,
    limit: null,
    offset: null,
    namequery: null,
    nlat: null, slat: null, elon: null, wlon: null
  };

  var orderby = req.query.orderby;
  var direction = req.query.direction;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var namequery = req.query.namequery;
  var nlat = req.query.nlat;
  var slat = req.query.slat;
  var elon = req.query.elon;
  var wlon = req.query.wlon;

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

  // Search query string in cultural asset name
  if (namequery) options.namequery = namequery;

  // Map boundaries can be all set or none set
  if (!nlat && !slat && !elon && !wlon) {
    options.nlat = null;
    options.slat = null;
    options.elon = null;
    options.wlon = null;
  } else if (nlat && slat && elon && wlon) {
    // Return error if any of the boundaries parameters is not valid
    if (isNaN(nlat) || isNaN(slat) || isNaN(elon) || isNaN(wlon)) {
      return res.status(400).json({ message: 'Invalid map boundaries parameter(s) ' });
    }
    // Set boundaries in options object
    options.nlat = parseFloat(nlat);
    options.slat = parseFloat(slat);
    options.elon = parseFloat(elon);
    options.wlon = parseFloat(wlon);
  } else {
    return res.status(400).json({ message: 'Missing map boundaries parameter(s)' })
  }

  AssetService.get(options, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error retrieving assets' });
    }

    return res.json(data);
  });

}

/**
 * GET bene culturale (detail)
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 */
exports.getOne = (req, res) => {
  var id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'id required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  id = parseInt(id);

  AssetService.getOne(id, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error retrieving asset' });
    }

    return res.json(data);
  });
}

/**
 * GET - Ottieni i beni culturali di un utente specifico
 * @param {*} req 
 * @param {*} res 
 * 
 */
exports.getUserAssets = (req, res) => {
  // req.user.sub - userid
  // req.user.role - user role ('fruitore', 'esperto', ...)
  options = {
    orderby: null,
    direction: null,
    limit: null,
    offset: null,
    namequery: null
  };

  var userId = req.user.sub; // user id
  var orderby = req.query.orderby;
  var direction = req.query.direction;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var namequery = req.query.namequery;

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

  // Search query string in asset name
  if (namequery) options.namequery = namequery;

  // Parse user id
  userId = parseInt(userId);

  AssetService.getUserAssets(userId, options, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error retrieving assets' });
    }

    return res.json(data);
  });
}

/**
 * PUT update bene culturale
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateAsset = (req, res) => {
  var id = req.params.id;
  var asset = req.body;

  if (!id) {
    return res.status(400).json({ message: 'id required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  // Parse asset id
  id = parseInt(id);

  AssetService.updateAsset(id, asset, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error saving asset' });
    }

    return res.json(data);
  });
}

/**
 * POST nuovo bene culturale
 * @param {*} req 
 * @param {*} res 
 */
exports.createAsset = (req, res) => {
  var asset = new AssetModel({
    created_at: new Date(),
    modified_at: new Date(),
    nome: req.body.nome,
    descr: req.body.descr,
    lat: req.body.lat,
    lon: req.body.lon,
    cover_img_url: req.body.cover_img_url,
    visible: req.body.visible
  });

  AssetService.createAsset(req.user, asset, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error creating asset' });
    }

    return res.json(data);
  });
}

exports.deleteAsset = (req, res) => {
  var id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'id required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Parse asset id
  id = parseInt(id);

  AssetService.deleteAsset(req.user, id, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Error deleting cultural asset' });
    }

    return res.json(data);
  });
}