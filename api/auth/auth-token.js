const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user.userID,
        username: user.username
    }
    const secret = process.env.TOKEN_SECRET
    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secret, options);
}

module.exports = {
    generateToken
}