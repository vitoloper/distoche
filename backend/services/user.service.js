const config = require('../config/jwt.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

/**
 * Signup service
 * 
 * @param {*} userdata 
 * @param {*} result 
 * 
 */
exports.signup = (userdata, result) => {
    // Hash cleartext password
    bcrypt.hash(userdata.password, 10, (hashErr, hashedPwd) => {
        if (hashErr) {
            return result(hashErr, null);
        }

        // Create a user
        const user = new UserModel({
            created_at: new Date(),
            modified_at: new Date(),
            username: userdata.username,
            email: userdata.email,
            nome: userdata.nome,
            cognome: userdata.cognome,
            data_nascita: userdata.data_nascita,
            citta_residenza: userdata.citta_residenza,
            password: hashedPwd,
            role: Role.fruitore,     // default role is 'fruitore'
            enabled: true
        });

        // Insert a new user
        UserModel.create(user, (err, data) => {
            if (err) {
                return result(err, null);
            }

            return result(null, data);
        });
    }); // bcrypt.hash
} // signup
