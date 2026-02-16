const express = require('express');
const db = require('../data/db');
const mysql = require("mysql2");
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
            monster: 'none',
            monsterStats: null
        };

        res.json({ id: gameID });

    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }

}

//Recuperation de la partie depuis l'ID de la partie
exports.getGame = async function getGame(req, res) {

    const gameID = req.params.id;
    if (cache[gameID]) {
        return res.json(cache[gameID]);
    }

    try {

        const game = await db.query(
            `SELECT * FROM games WHERE ID = ?`,
            [gameID]
        );

        if (!game) {
            return res.status(404).send('Game not found');
        }

        cache[gameID] = {
            seed: game.seed,
            currentFloor: game.current_floor,
            monster: game.current_monster,
            monsterStats: {
                hp: game.monster_hp,
                atk: game.monster_atk,
                def: game.monster_def
            }
        };

        res.send(result);

    } catch (err) {
        console.error(err);
        res.status(500).send('DB error');
    }
}

//Avancer dans la partie

exports.move = async function move(req, res) {

    const gameID = req.params.id;
    const currentFloor = await getCurrentFloor(gameID);
    await generateNextFloor(gameID, currentFloor);
    console.log(await getMonster(gameID));

    try {

        const newFloor = currentFloor + 1;
        await db.query('UPDATE games SET current_floor = ? WHERE ID = ?', [newFloor, gameID]);

    } catch (err) {

        console.error(err);
        res.status(500).send('DB error');

    }
}

//Attaquer
exports.attack = async function attack(req, res) {

    gameID = req.params.id;
    const monster = await getMonster(gameID);

    console.log(monster.name);
    console.log(monster.hp);
    console.log(monster.atk);
    console.log(monster.def);

}

//Verifications :

async function getCurrentFloor(gameID) {

    const cache = getCache(gameID);
    if (cache.currentFloor !== undefined) {
        return cache.currentFloor;
    }

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

    const seed = await getSeed(gameID);

    const rng = seedrandom(seed * floor);
    const roll = (rng() * 100)

    let monsterCount = 3

    if (roll > 50) {
        generateMonster(gameID, ((Math.round(roll) % monsterCount) + 1), floor);
    } else {
        generateMonster(gameID, 0, floor);
    }

}

async function generateMonster(gameID, monsterID, floor) {

    let monster_list = ["none", "zombie", "skeleton", "dragon"];
    let monster = monster_list[monsterID];

    const monsterStats = {
        hp: 1,
        atk: 1,
        def: 1
    }

    const cache = getCache(gameID);
    cache.monster = monster;
    cache.monsterStats = monsterStats;

    await db.query(
        'UPDATE games SET current_monster = ?, monster_hp = ?, monster_atk = ?, monster_def = ? WHERE ID = ?',
        [monster, monsterStats.hp, monsterStats.atk, monsterStats.def, gameID]
    );
}

async function getMonster(gameID) {

    const monster = await db.getOne(`SELECT current_monster, monster_hp, monster_atk, monster_def FROM games WHERE ID = ?`, [gameID]);

    if (!monster) {
        throw new Error("Game not found");
    }

    return {
        name: monster.current_monster,
        hp: monster.monster_hp,
        atk: monster.monster_atk,
        def: monster.monster_def
    };
};