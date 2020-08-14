const AssetModel = require('../models/asset.model');
const AssetService = require('../services/asset.service');

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
