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

/**
 * GET beni culturali utente specifico
 * 
 * @param {*} userId 
 * @param {*} options 
 * @param {*} result 
 * 
 */
exports.getUserAssets = (userId, options, result) => {
  AssetModel.getUserAssets(userId, options, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}

/**
 * Update bene culturale
 * 
 * @param {*} id 
 * @param {*} asset 
 * @param {*} result 
 * 
 */
exports.updateAsset = (id, asset, result) => {
  asset.modified_at = new Date();

  AssetModel.update(id, asset, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, asset);
  });
}

/**
 * Crea un bene culturale
 * @param {*} user 
 * @param {*} asset 
 * @param {*} result 
 */
exports.createAsset = (user, asset, result) => {
  asset.owner = user.sub;

  AssetModel.create(asset, (err, data) => {
    if (err) {
      return result(err, null);
    }

    return result(null, data);
  });
}