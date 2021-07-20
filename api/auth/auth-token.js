const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/index')

const generateToken = (user) => {
    const payload = {
        id: user.userID,
        role: user.role,
        username: user.username
    };
    const secret = JWT_SECRET;
    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secret, options);
}

module.exports = {
    generateToken
}