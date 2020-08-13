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

  var query;

  if (options.namequery !== null) {
    var namequery = '%' + options.namequery + '%';
    // Descending order or ascending order
    if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
      query = mysql.format('SELECT * FROM bene WHERE `visible` = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? AND `nome` LIKE ? ORDER BY ?? DESC LIMIT ? OFFSET ?', [slat, nlat, wlon, elon, namequery, orderby, limit, offset]);
    } else {
      query = mysql.format('SELECT * FROM bene WHERE `visible` = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? AND `nome` LIKE ? ORDER BY ?? ASC LIMIT ? OFFSET ?', [slat, nlat, wlon, elon, namequery, orderby, limit, offset]);
    }
  } else {
    // Descending order or ascending order
    if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
      query = mysql.format('SELECT * FROM bene WHERE `visible` = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? ORDER BY ?? DESC LIMIT ? OFFSET ?', [slat, nlat, wlon, elon, orderby, limit, offset]);
    } else {
      query = mysql.format('SELECT * FROM bene WHERE `visible` = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? ORDER BY ?? ASC LIMIT ? OFFSET ?', [slat, nlat, wlon, elon, orderby, limit, offset]);
    }
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
        countQuery = mysql.format('SELECT COUNT(*) AS total FROM bene WHERE visible = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ? AND nome LIKE ?', [slat, nlat, wlon, elon, namequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(*) AS total FROM bene WHERE visible = 1 AND lat >= ? AND lat <= ? AND lon >= ? AND lon <= ?', [slat, nlat, wlon, elon]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalAssets = res[0].total;

        connection.query(query, (err, res) => {
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

module.exports = Asset;
