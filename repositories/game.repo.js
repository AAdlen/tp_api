const express = require('express');
const db = require('../data/db');
const mysql = require("mysql2");
const playerService = require('../services/players.service');
const gameService = require('../services/games.service')
const seedrandom = require('seedrandom');

const cache = {};

function getCache(gameID) {
    if (!cache[gameID]) {
        cache[gameID] = {};
    }
    return cache[gameID];
}

//Creation de la partie avec l'ID du joueur

exports.createGame = async function createGame(req, res) {

    seed = Math.round(Math.random() * 1000000000000)

    try {

        const result = await db.query(
            'INSERT INTO games (player_id, seed) VALUES (?, ?)',
            [req.params.id, seed]
        );

        const gameID = result.insertId;

        cache[gameID] = {
            seed: seed,
            currentFloor: 0,
            monster: 0,
            monsterStats: null,
            lastAction: 0
        };

        res.json({ id: gameID });

    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }

}

//Recuperation de la partie depuis l'ID de la partie
exports.getGameById = async function getGameById(req, res) {

    try {
        const game = await gameService.getGame(req.params.id);

        if (!game) {
            return res.status(404).send("Game not found");
        }

        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
}

//Avancer dans la partie

exports.move = async function move(req, res) {

    const gameID = req.params.id;

    const currentFloor = await getCurrentFloor(gameID);
    await generateNextFloor(gameID, currentFloor);
    const nextMonster = await getCurrentMonster(gameID)

    try {

        const newFloor = currentFloor + 1;
        await db.query('UPDATE games SET current_floor = ? WHERE ID = ?', [newFloor, gameID]);
        if (newFloor==101){
            try {

                await db.query('UPDATE games SET status = ? WHERE ID = ?', ["won", gameID]);
                res.json({ victory: "true" });

            } catch (err) {

                console.error(err);
                res.status(500).send('DB error');

            }
    }
        res.json({ monster: nextMonster });


    } catch (err) {

        console.error(err);
        res.status(500).send('DB error');

    }
}

//Attaquer

exports.attack = async function attack(req, res) {

    gameID = req.params.id;

    const monster = await getCurrentMonster(gameID);
    const game = await gameService.getGame(gameID);
    const player = await playerService.getPlayer(game.player_id);

    let damage = (player.str + player.int) - monster.def;

    if (damage < 0) {
        damage = 0;
    }

    if (damage >= monster.hp) {
        
        let heal = player.hp + Math.round(15 + (game.current_floor*0.07))

        if(heal>player.maxhp){  
            heal = player.maxhp;
        }

        try {

                await db.query('UPDATE players SET hp = ? WHERE ID = ?', [heal, gameID]);

            } catch (err) {

                console.error(err);
                res.status(500).send('DB error');

            }

        res.json({
            monster: "killed"
        });
    } else {
        try {

            await db.query('UPDATE games SET monster_hp = ? WHERE ID = ?', [((monster.hp) - (damage)), gameID]);

        } catch (err) {

            console.error(err);
            res.status(500).send('DB error');

        }

        let monsterDamage = monster.atk - player.def;

        if (monsterDamage < 0) {
            monsterDamage = 0;
        }

        if (monsterDamage > player.hp) {
            try {

                await db.query('UPDATE games SET status = ? WHERE ID = ?', ["died", gameID]);

            } catch (err) {

                console.error(err);
                res.status(500).send('DB error');

            }
            res.json({ player: "killed" });

        } else {

            try {

                await db.query('UPDATE players SET hp = ? WHERE ID = ?', [((player.hp) - (monsterDamage)), gameID]);
                res.json({ monsterDamageDealt: damage });

            } catch (err) {

                console.error(err);
                res.status(500).send('DB error');

            }
        }
    }



}

//Verifications :

async function getCurrentFloor(gameID) {

    const result = await db.getOne('SELECT current_floor FROM games WHERE ID = ?', [gameID]);
    return result.current_floor;
}

async function getSeed(gameID) {
    const cache = getCache(gameID);
    if (cache.seed !== undefined) {
        return cache.seed;
    }

    const result = await db.getOne('SELECT seed FROM games WHERE ID = ?', [gameID]);
    return result.seed;

}

async function generateNextFloor(gameID, floor) {

    const info = await getMonsterCount()
    const monsterCount = info.monsterCount['COUNT(*)'];

    const seed = await getSeed(gameID);

    const rng = seedrandom(seed * floor);
    const roll = (rng() * 100)

    if (roll > 50) {
        generateMonster(gameID, ((Math.round(roll) % monsterCount) + 1), floor);
    } else {
        generateMonster(gameID, 0, floor);
    }

}

async function generateMonster(gameID, monsterID, floor) {

    const monster = await gameService.getMonster(monsterID);

    const cache = getCache(gameID);
    cache.monster = monster;

    await db.query(
        'UPDATE games SET current_monster = ?, monster_hp = ?, monster_atk = ?, monster_def = ? WHERE ID = ?',
        [monster.id, (monster.hp + Math.round(floor * 0.2)), (monster.atk + Math.round(floor * 0.1)), (monster.def + Math.round(floor * 0.05)), gameID]
    );
}

async function getCurrentMonster(gameID) {

    const monster = await db.getOne(`SELECT current_monster, monster_hp, monster_atk, monster_def FROM games WHERE ID = ?`, [gameID]);

    if (!monster) {
        throw new Error("Game not found");
    }

    return {
        id: monster.current_monster,
        hp: monster.monster_hp,
        atk: monster.monster_atk,
        def: monster.monster_def
    };
};

async function getMonsterCount() {

    const monsterCount = await db.getOne(`SELECT COUNT(*) FROM monsters`);

    if (!monsterCount) {
        throw new Error("Error");
    }

    return {
        monsterCount
    };
};