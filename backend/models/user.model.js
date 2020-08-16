const bcrypt = require('bcrypt');
const sql = require("./db.js");
const mysql = require("mysql");
const logger = require("../config/winston");

const User = function (user) {
  this.id = user.id;
  this.created_at = user.created_at;
  this.modified_at = user.modified_at;
  this.role = user.role;
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
  this.nome = user.nome;
  this.cognome = user.cognome;
  this.sesso = user.sesso;
  this.data_nascita = user.data_nascita;
  this.citta_residenza = user.citta_residenza;
  this.short_bio = user.short_bio;
  this.profile_img_url = user.profile_img_url;
  this.enabled = user.enabled;
}

/**
 * Find a user given a username and password
 * 
 */
User.findByUsernameAndPassword = (username, password, resultFunc) => {
  sql.query('SELECT * FROM utente WHERE username=?', [username], (err, res) => {
    if (err) {
      logger.error(err);
      resultFunc(err, null);
    } else {
      // No user found with the username given
      if (res.length === 0)
        return resultFunc(null, res);

      logger.info(`user.model.js - findByUsernameAndPassword - Number of rows returned: ${res.length}`);
      // Compare the (plaintext) password with the hash on the DB
      bcrypt.compare(password, res[0].password, (err, result) => {
        if (!result) {
          // Incorrect password
          resultFunc(null, []);
        } else {
          // Correct password, return the whole user row
          resultFunc(null, res);
        }
      });
    }
  });
}

module.exports = User;
