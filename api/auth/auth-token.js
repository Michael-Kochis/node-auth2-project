const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/index')

const generateToken = (user) => {
    
    const payload = {
        subject: user.user_id,
        role_name: user.role_id,
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