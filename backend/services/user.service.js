const config = require('../config/jwt.config.json');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');
const UserModel = require('../models/user.model.js');

/**
 * Authentication service
 * 
 * @param {*} username 
 * @param {*} password 
 * @param {*} result 
 */
exports.authenticate = (username, password, result) => {
    UserModel.findByUsernameAndPassword(username, password, (err, data) => {
        if (err) {
            return result(err, null);
        }

        if (data.length === 0) {
            return result(new Error("Incorrect username or password"), null);
        }

        // Found a user
        const user = data[0];
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;

        // Return a user object without hashed password and with a JWT token
        result(null, { ...userWithoutPassword, token });

    });
}
