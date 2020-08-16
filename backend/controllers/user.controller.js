const UserModel = require('../models/user.model');
const UserService = require('../services/user.service');

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
 * Test authentication
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 */
exports.testauth = (req, res) => {
  return res.status(200).json({ message: 'If you can see this it means you are authenticated.' });
}
