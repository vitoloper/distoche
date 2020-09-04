const UserModel = require('../models/user.model');
const UserService = require('../services/user.service');

/**
 * Email validation helper function
 */
function validateEmail(email) {
  // \S: match a character different than white space
  // +: one or more times
  // \.: match dot
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

/**
 * Authenticate an user
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 */
exports.authenticate = (req, res) => {

  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'invalid username or password' });
  }

  UserService.authenticate(req.body.username, req.body.password, (err, data) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Authentication error' });
    }

    return res.status(200).json(data);
  });
}

/**
 * User signup
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 */
exports.signup = (req, res) => {
  var userdata = {};

  userdata.username = req.body.username;
  userdata.email = req.body.email;
  userdata.nome = req.body.nome;
  userdata.cognome = req.body.cognome;
  userdata.data_nascita = req.body.data_nascita;
  userdata.citta_residenza = req.body.citta_residenza;
  userdata.password = req.body.password;

  // Check mandatory fields
  if (!userdata.username || !userdata.email || !userdata.password) {
    return res.status(400).json({ message: 'Missing parameter(s)' });
  }

  if (!validateEmail(userdata.email)) {
    return res.status(400).json({ message: 'Invalid e-mail' });
  }

  UserService.signup(userdata, (err, data) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Signup error' });
    }

    return res.status(200).json(data);
  });
}

/**
 * Test authentication
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 */
exports.testauth = (req, res) => {
  return res.status(200).json({ message: 'If you can see this it means you are authenticated.' });
}

/**
 * Get my profile information
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getMyUser = (req, res) => {
  return UserService.getMyUser(req.user, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Get profile information error' });
    }
    
    return res.status(200).json(data);
  });
}