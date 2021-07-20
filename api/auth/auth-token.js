const jwt = require('jsonwebtoken');
const roles = require('../roles/role-model');
const { JWT_SECRET } = require('../secrets/index')

const generateToken = async (user) => {
    const role = await roles.findById(user.role_id);
    
    const payload = {
        subject: user.user_id,
        role_name: role.role_name,
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