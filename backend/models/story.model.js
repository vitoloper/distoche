const sql = require("./db.js");
const mysql = require("mysql");
const logger = require("../config/winston");

// Model
const Story = function (story) {
  this.id = story.id;
  this.approved_at = story.approved_at;
  this.created_at = story.created_at;
  this.modified_at = story.modified_at;
  this.titolo = story.titolo;
  this.descr = story.descr;
  this.contenuto = story.contenuto;
  this.cover_img_url = story.cover_img_url;
  this.approved = story.approved;
  this.visible = story.visible;
  this.id_bene = story.id_bene;
  this.owner = story.owner;
  this.approved_by = story.approved_by;
};

/**
 * Ottieni le storie associate ad un bene culturale
 * 
 * @param {*} id - id bene culturale
 * @param {*} options 
 * @param {*} result 
 */
Story.getAssetStories = (id, options, result) => {
  var orderby, direction, limit, offset;

  // Order field
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

  // Order direction (DESC or ASC)
  var orderStr;
  if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
    orderStr = 'DESC';
  } else {
    orderStr = 'ASC';
  }

  var queryStr;

  if (options.titlequery !== null) {
    var titlequery = '%' + options.titlequery + '%';
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE id_bene = ? AND visible = 1 AND approved = 1 AND titolo LIKE ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, titlequery, orderby, limit, offset]);
  } else {
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE id_bene = ? AND visible = 1 AND approved = 1 ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, orderby, limit, offset]);
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
      if (options.titlequery !== null) {
        var titlequery = '%' + options.titlequery + '%';
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE id_bene = ? AND approved = 1 AND visible = 1 AND titolo LIKE ?', [id, titlequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE id_bene = ? AND approved = 1 AND visible = 1', [id]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalStories = res[0].total;

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

            logger.log('info', `story.model.js - getAssetStories - number of rows returned: ${res.length}`)
            connection.release();
            if (connErr) {
              return result(connErr, null)
            };

            // Return number of total stories and data
            return result(null, { total: totalStories, data: resultData });
          });

        });
      });
    }); // beginTransaction
  }); // getConnection
}; // Story.getAssetStories

/**
 * Ottieni le storie associate ad un bene culturale (role 'esperto')
 * @param {*} id 
 * @param {*} options 
 * @param {*} result 
 * 
 */
Story.getAssetStoriesEsperto = (userId, id, options, result) => {
  var orderby, limit, offset;

  // Order field
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

  // Order direction (DESC or ASC)
  var orderStr;
  if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
    orderStr = 'DESC';
  } else {
    orderStr = 'ASC';
  }

  var queryStr;

  if (options.titlequery !== null) {
    var titlequery = '%' + options.titlequery + '%';
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE id_bene = ? AND ((visible = 1 AND owner <> ?) OR (owner = ?)) AND titolo LIKE ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, userId, userId, titlequery, orderby, limit, offset]);
  } else {
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE id_bene = ? AND ((visible = 1 AND owner <> ?) OR (owner = ?)) ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, userId, userId, orderby, limit, offset]);
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
      if (options.titlequery !== null) {
        var titlequery = '%' + options.titlequery + '%';
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE id_bene = ? AND ((visible = 1 AND owner <> ?) OR (owner = ?)) AND titolo LIKE ?', [id, userId, userId, titlequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE id_bene = ? AND ((visible = 1 AND owner <> ?) OR (owner = ?))', [id, userId, userId]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalStories = res[0].total;

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

            logger.log('info', `story.model.js - getAssetStories - number of rows returned: ${res.length}`)
            connection.release();
            if (connErr) {
              return result(connErr, null)
            };

            // Return number of total stories and data
            return result(null, { total: totalStories, data: resultData });
          });

        });
      });
    }); // beginTransaction
  }); // getConnection
}; // Story.getAssetStoriesEsperto

/**
 * Ottieni le storie associate ad un bene culturale (utente 'fruitore')
 * 
 * @param {*} userId 
 * @param {*} id 
 * @param {*} options 
 * @param {*} result 
 */
Story.getAssetStoriesFruitore = (userId, id, options, result) => {
  var orderby, limit, offset;

  // Order field
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

  // Order direction (DESC or ASC)
  var orderStr;
  if (options.direction !== null && options.direction.toLowerCase() === 'desc') {
    orderStr = 'DESC';
  } else {
    orderStr = 'ASC';
  }

  var queryStr;

  if (options.titlequery !== null) {
    var titlequery = '%' + options.titlequery + '%';
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE id_bene = ? AND ((visible = 1 AND approved = 1 AND owner <> ?) OR (owner = ?)) AND titolo LIKE ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, userId, userId, titlequery, orderby, limit, offset]);
  } else {
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE id_bene = ? AND ((visible = 1 AND approved = 1 AND owner <> ?) OR (owner = ?)) ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, userId, userId, orderby, limit, offset]);
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
      if (options.titlequery !== null) {
        var titlequery = '%' + options.titlequery + '%';
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE id_bene = ? AND ((visible = 1 AND approved = 1 AND owner <> ?) OR (owner = ?)) AND titolo LIKE ?', [id, userId, userId, titlequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE id_bene = ? AND ((visible = 1 AND approved = 1 AND owner <> ?) OR (owner = ?))', [id, userId, userId]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalStories = res[0].total;

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

            logger.log('info', `story.model.js - getAssetStories - number of rows returned: ${res.length}`)
            connection.release();
            if (connErr) {
              return result(connErr, null)
            };

            // Return number of total stories and data
            return result(null, { total: totalStories, data: resultData });
          });

        });
      });
    }); // beginTransaction
  }); // getConnection
}; // Story.getAssetStoriesFruitore


/**
 * Ottieni storie di un utente specifico
 * 
 * @param {*} id - id utente 
 * @param {*} options 
 * @param {*} result 
 * 
 */
Story.getUserStories = (id, options, result) => {
  var orderby, direction, limit, offset;

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

  if (options.titlequery !== null) {
    var titlequery = '%' + options.titlequery + '%';
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE owner = ? AND titolo LIKE ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, titlequery, orderby, limit, offset]);
  } else {
    queryStr = mysql.format(`SELECT id, approved_at, created_at, modified_at, titolo, descr, cover_img_url, approved, visible, id_bene, owner, approved_by FROM storia WHERE owner = ? ORDER BY ?? ${orderStr} LIMIT ? OFFSET ?`, [id, orderby, limit, offset]);
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
      if (options.titlequery !== null) {
        var titlequery = '%' + options.titlequery + '%';
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE owner = ? AND titolo LIKE ?', [id, titlequery]);
      } else {
        countQuery = mysql.format('SELECT COUNT(id) AS total FROM storia WHERE owner = ?', [id]);
      }

      connection.query(countQuery, (err, res) => {
        if (err) {
          connection.release();
          return result(err, null);
        };

        var totalStories = res[0].total;

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

            logger.log('info', `story.model.js - getUserStories - number of rows returned: ${res.length}`)
            connection.release();
            if (connErr) {
              return result(connErr, null)
            };

            // Return number of total stories and data
            return result(null, { total: totalStories, data: resultData });
          });

        });
      });
    }); // beginTransaction
  }); // getConnection
}; // Story.getUserStories

/**
 * Dettaglio storia
 * 
 * @param {*} id 
 * @param {*} result
 *  
 */
Story.getOne = (id, result) => {
  queryStr = 'SELECT S.id, S.approved_at, S.created_at, S.modified_at, S.titolo, S.descr, S.contenuto, S.cover_img_url, S.approved, S.visible,' +
    ' S.id_bene, O.username as owner_username, A.username as approver_username' +
    ' FROM storia S JOIN utente O ON S.owner = O.id JOIN utente A ON S.approved_by = A.id' +
    ' WHERE S.id = ? AND S.visible = 1 AND S.approved = 1';

  sql.query(queryStr, id, (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    if (res.length > 0) {
      logger.info(`story.model.js - getOne - story id: ${res[0].id}`);
    }

    return result(null, res);
  });
}; // Story.getOne

/**
 * Dettaglio storia (utente fruitore)
 * @param {*} id 
 * @param {*} result 
 */
Story.getOneFruitore = (userId, id, result) => {
  queryStr = 'SELECT S.id, S.approved_at, S.created_at, S.modified_at, S.titolo, S.descr, S.contenuto, S.cover_img_url, S.approved, S.visible,' +
    ' S.id_bene, O.username as owner_username, A.username as approver_username' +
    ' FROM storia S JOIN utente O ON S.owner = O.id LEFT JOIN utente A ON S.approved_by = A.id' +
    ' WHERE S.id = ? AND ((S.owner = ?) OR (S.owner <> ? AND visible = 1 AND approved = 1))';

  sql.query(queryStr, [id, userId, userId], (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    if (res.length > 0) {
      logger.info(`story.model.js - getOne - story id: ${res[0].id}`);
    }

    return result(null, res);
  });
}; // Story.getOneFruitore

/**
 * Dettaglio storia (utente esperto)
 * 
 * @param {*} id 
 * @param {*} result 
 */
Story.getOneEsperto = (userId, id, result) => {
  queryStr = 'SELECT S.id, S.approved_at, S.created_at, S.modified_at, S.titolo, S.descr, S.contenuto, S.cover_img_url, S.approved, S.visible,' +
    ' S.id_bene, O.username as owner_username, A.username as approver_username' +
    ' FROM storia S JOIN utente O ON S.owner = O.id LEFT JOIN utente A ON S.approved_by = A.id' +
    ' WHERE S.id = ? AND ((S.owner = ?) OR (S.owner <> ? AND S.visible = 1))';

  sql.query(queryStr, [id, userId, userId], (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    if (res.length > 0) {
      logger.info(`story.model.js - getOne - story id: ${res[0].id}`);
    }

    return result(null, res);
  });
}; // Story.getOneEsperto

/**
 * Update storia
 * 
 * @param {*} id 
 * @param {*} story 
 * @param {*} result 
 * 
 */
Story.update = (id, story, result) => {
  queryStr = 'UPDATE storia SET modified_at = ?, titolo = ?, descr = ?, contenuto = ?,  ' +
    'cover_img_url = ?, visible = ? WHERE id = ?';

  sql.query(queryStr, [story.modified_at, story.titolo, story.descr, story.contenuto, story.cover_img_url, story.visible, id], (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    return result(null, res);
  });
}

/**
 * Crea una nuova storia
 * 
 * @param {} newStory 
 * @param {*} result 
 * 
 */
Story.create = (newStory, result) => {
  sql.query('INSERT INTO storia SET ?', newStory, (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    newStory.id = res.insertId;
    return result(null, newStory);
  });
}

/**
 * Cancella una storia (appartenente all'utente che la cancella)
 * 
 * @param {*} userId 
 * @param {*} id 
 * @param {*} result 
 * 
 */
Story.delete = (userId, id, result) => {
  sql.query('DELETE FROM storia WHERE id = ? AND owner = ?', [id, userId], (err, res) => {
    if (err) {
      logger.error(err);
      return result(err, null);
    }

    return result(null, res);
  });
}

module.exports = Story;
