const sql = require("./db.js");
const mysql = require("mysql");
const logger = require("../config/winston");

// Model
const Asset = function (asset) {
  this.id = asset.id;
  this.created_at = asset.created_at;
  this.modified_at = asset.modified_at;
  this.nome = asset.nome;
  this.lat = asset.lat;
  this.lon = asset.lon;
  this.descr = asset.descr;
  this.cover_img_url = asset.cover_img_url;
  this.visible = asset.visible;
  this.owner = asset.owner;
};

/**
 * Get assets from db
 * 
 * @param {*} options - options
 * @param {*} result - callback 
 * 
 */
Asset.get = (options, result) => {
  var orderby, direction, limit, offset;
  var nlat, slat, elon, wlon;

  if (options.orderby !== null) {
    orderby = options.orderby;
  } else {
    // Ordinamento di default: data di creazione
    orderby = 'created_at';
  }

  // Check limit and offset options and set default values if any of them is null
  if (options.limit !== null && options.offset !== null) {
    limit = options.limit;
    offset = options.offset;
  } else {
    limit = 100;
    offset = 0;
  }

  // Check map boundaries options and set default values if any of them is null
  if (options.nlat !== null && options.slat !== null && options.elon !== null && options.wlon !== null) {
    nlat = options.nlat;
    slat = options.slat;
    elon = options.elon;
    wlon = options.wlon;
  } else {
    nlat = 90;
    slat = -90;
    elon = 180;
    wlon = -180;
  }

  // logger.log('info', `asset.model.js - get - map boundaries - nlat:${nlat}, slat:${slat}, elon:${elon}, wlon:${wlon}`);

  // Order direction
  var orderStr;
  if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
    orderStr = 'DESC';
  } else {
    orderStr = 'ASC';
  }

  var queryStr;

  if (options.namequery !== null) {
    var namequery = '%' + options.namequery + '%';
    queryStr = mysql.format(`SELECT * FROM bene WHERE visible = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? AND nome LIKE ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [slat, nlat, wlon, elon, namequery, orderby, limit, offset]);
  } else {
    queryStr = mysql.format(`SELECT * FROM bene WHERE visible = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [slat, nlat, wlon, elon, orderby, limit, offset]);
  }

  // Get a connection from the pool
  sql.getConnection((connErr, connection) => {
    if (connErr) return result(connErr, null);

    // Begin a transaction to get total number and data
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        return result(err, null);
      };

      var countQuery;
      if (options.namequery !== null) {
        var namequery = '%' + options.namequery + '%';
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM bene WHERE visible = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? AND nome LIKE ?', [slat, nlat, wlon, elon, namequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM bene WHERE visible = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ?', [slat, nlat, wlon, elon]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalAssets = res[0].total;

        connection.query(queryStr, (err, res) => {
          if (err) {
            connection.release();
            return result(err, null);
          };

          var resultData = res;

          connection.commit((err) => {
            if (err) {
              connection.release();
              return result(err, null);
            };

            logger.log('info', `asset.model.js - get - number of rows returned: ${res.length}`)
            connection.release();
            if (connErr) {
              return result(connErr, null)
            };

            // Return number of total employees and data
            return result(null, { total: totalAssets, data: resultData });
          });

        });
      });
    }); // beginTransaction
  }); // getConnection
}; // Asset.get

/**
 * Get asset detail from db
 * 
 * @param {*} id 
 * @param {*} result
 * 
 */
Asset.getOne = (id, result) => {
  sql.query('SELECT B.id, B.created_at, B.modified_at, B.nome, B.lat, B.lon, B.descr, B.cover_img_url, B.visible, U.username AS owner_username FROM bene B JOIN utente U ON B.owner = U.id WHERE B.id = ?', id, (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    if (res.length > 0)
      logger.info(`asset.model.js - getOne - asset id: ${res[0].id}`);

    result(null, res);
  });
}

/**
 * Ottieni beni culturali di un utente specifico
 * 
 * @param {*} id - id utente 
 * @param {*} options 
 * @param {*} result 
 * 
 */
Asset.getUserAssets = (id, options, result) => {
  var orderby, limit, offset;

  if (options.orderby !== null) {
    orderby = options.orderby;
  } else {
    // Ordinamento di default: data di creazione
    orderby = 'created_at';
  }

  // Check limit and offset options and set default values if any of them is null
  if (options.limit !== null && options.offset !== null) {
    limit = options.limit;
    offset = options.offset;
  } else {
    limit = 100;
    offset = 0;
  }

  var orderStr;
  if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
    orderStr = 'DESC';
  } else {
    orderStr = 'ASC';
  }

  var queryStr;

  if (options.namequery !== null) {
    var namequery = '%' + options.namequery + '%';
    queryStr = mysql.format(`SELECT * FROM bene WHERE owner = ? AND nome LIKE ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, namequery, orderby, limit, offset]);
  } else {
    queryStr = mysql.format(`SELECT * FROM bene WHERE owner = ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, orderby, limit, offset]);
  }

  // Get a connection from the pool
  sql.getConnection((connErr, connection) => {
    if (connErr) return result(connErr, null);

    // Begin a transaction to get total number and data
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        return result(err, null);
      };

      var countQuery;
      if (options.namequery !== null) {
        var namequery = '%' + options.namequery + '%';
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM bene WHERE owner = ? AND nome LIKE ?', [id, namequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM bene WHERE owner = ?', [id]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalAssets = res[0].total;

        connection.query(queryStr, (err, res) => {
          if (err) {
            connection.release();
            return result(err, null);
          };

          var resultData = res;

          connection.commit((err) => {
            if (err) {
              connection.release();
              return result(err, null);
            };

            logger.log('info', `asset.model.js - getUserAssets - number of rows returned: ${res.length}`)
            connection.release();
            if (connErr) {
              return result(connErr, null)
            };

            // Return number of total assets and data
            return result(null, { total: totalAssets, data: resultData });
          });

        });
      });
    }); // beginTransaction
  }); // getConnection
}; // Asset.getUserAssets

/**
 * Update asset
 * 
 * @param {*} id 
 * @param {*} asset 
 * @param {*} result 
 * 
 */
Asset.update = (id, asset, result) => {
  // TODO: lat, lon
  queryStr = 'UPDATE bene SET modified_at = ?, nome = ?, descr = ?, ' +
    'cover_img_url = ?, visible = ? WHERE id = ?';

  sql.query(queryStr, [asset.modified_at, asset.nome, asset.descr, asset.cover_img_url, asset.visible, id], (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    return result(null, res);
  });
}

Asset.create = (newAsset, result) => {
  sql.query('INSERT into bene SET ?', newAsset, (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    newAsset.id = res.insertId;
    return result(null, newAsset);
  });
}

/**
 * Cancella un bene culturale (appartenente all'utente che lo cancella)
 * 
 * @param {*} userId 
 * @param {*} id 
 * @param {*} result 
 * 
 */
Asset.delete = (userId, id, result) => {
  sql.query('DELETE FROM bene WHERE id = ? AND owner = ?', [id, userId], (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    return result(null, res);
  });
}

module.exports = Asset;
