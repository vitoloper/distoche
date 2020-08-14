const AssetModel = require('../models/asset.model');

/**
 * Servizio GET beni culturali
 * 
 * @param {*} options 
 * @param {*} result 
 * 
 */
exports.get = (options, result) => {
  AssetModel.get(options, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}

/**
 * Servizio GET bene culturale (dettaglio)
 * 
 * @param {*} result 
 * 
 */
exports.getOne = (id, result) => {
  AssetModel.getOne(id, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}
