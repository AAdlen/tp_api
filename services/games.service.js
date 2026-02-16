const db = require('../data/db');

exports.getGame = async function getGame(id) {
    return await db.getOne(
            'SELECT * FROM games WHERE ID = ?',
            [id]
        );
}