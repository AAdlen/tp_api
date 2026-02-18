const db = require('../data/db');

exports.getGame = async function getGame(id) {
    return await db.getOne(
        'SELECT * FROM games WHERE ID = ?',
        [id]
    );
}

exports.getMonster = async function (id) {

    if (id != 0) {
        return await db.getOne(
            'SELECT * FROM monsters WHERE ID = ?',
            [id]
        );
    } else {
        const monster = {
            id: 0,
            hp: 0,
            atk: 0,
            def: 0
        }
        return monster
    }
};