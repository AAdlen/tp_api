const db = require('../data/db');

exports.getPlayer = async function(id) {
    return await db.getOne(
        'SELECT * FROM players WHERE ID = ?',
        [id]
    );
};