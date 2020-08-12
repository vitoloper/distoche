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
    namequery: null
  };

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

  if (namequery) options.namequery = namequery;

  AssetService.get(options, (err, data) => {
    if (err) {
      return res.status(500).json({message: err.message || 'Error retrieving assets'});
    }
    
    return res.json(data);
  });

}
