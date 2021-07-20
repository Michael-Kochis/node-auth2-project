const db = require('../../data/db-config.js');

const findById = async (role_id) => {
    return await db('roles')
        .where({ role_id })
        .first();
}

module.exports = {
    findById
}