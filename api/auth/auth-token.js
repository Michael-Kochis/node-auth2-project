const jwt = require('jsonwebtoken');

const generateToken = async (user) => {
    const payload = {
        id: user.userID,
        role: user.role,
        username: user.username
    }
    const secret = process.env.TOKEN_SECRET
    const options = {
        expiresIn: '1d'
    }

    return await jwt.sign(payload, secret, options);
}

module.exports = {
    generateToken
}