const express = require('express');
const mysql = require("mysql2");
const seedrandom = require('seedrandom');

//Creation de la partie avec l'ID du joueur

exports.createGame = async function createGame(req, res) {

    seed = Math.round(Math.random() * 1000000000000)

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `INSERT INTO games (player_id, seed) VALUES (?, ?)`;

    DB.query(query, [req.params.id, seed], function (err, result, fields) {

        if (err) throw err;
        gameID = result.insertId;
        res.json({ id: gameID });

    });

}

//Recuperation de la partie depuis l'ID de la partie
exports.getGame = async function getGame(req, res) {

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `SELECT * FROM games WHERE ID = ?`;

    DB.query(query, [req.params.id], function (err, result, fields) {

        if (err) throw err;
        res.send(result);
    });

}

//Avancer dans la partie

exports.move = async function move(req, res) {

    gameID = req.params.id;
    const currentFloor = await getCurrentFloor(gameID);
    generateNextFloor(gameID, currentFloor);
    console.log(await getMonster(gameID));


    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `UPDATE games SET current_floor = ? WHERE ID = ?`;

    DB.query(query, [currentFloor + 1, gameID], function (err, result, fields) {

        if (err) throw err;

    });

}

//Attaquer
exports.attack = async function attack(req, res) {

    gameID = req.params.id;
    const currentMonster = getMonster(gameID);

    

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `UPDATE games SET current_floor = ? WHERE ID = ?`;

    DB.query(query, [currentFloor + 1, gameID], function (err, result, fields) {

        if (err) throw err;

    });

}

//Verifier l'étage actuel du joueur

async function getCurrentFloor(id) {

    return new Promise((resolve, reject) => {

        const DB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "frogue"
        });


        DB.connect();

        const query = `SELECT current_floor FROM games WHERE ID = ?`;

        DB.query(query, [id], function (err, result, fields) {

            if (err) {
                reject(err);
                return;
            }
            resolve(result[0].current_floor);

        });
    });
}

async function getSeed(id) {

    return new Promise((resolve, reject) => {

        const DB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "frogue"
        });


        DB.connect();

        const query = `SELECT seed FROM games WHERE ID = ?`;

        DB.query(query, [id], function (err, result, fields) {

            if (err) {
                reject(err);
                return;
            }
            resolve(result[0].seed);

        });
    });
}

async function generateNextFloor(id, floor) {

    const seed = await getSeed(id);

    const rng = seedrandom(seed * floor);
    const roll = (rng() * 100)
    console.log(roll);
    
    let monsterCount = 3

    if(roll>50){
        generateMonster(id,((Math.round(roll)%monsterCount)+1),floor);
    } else {
        generateMonster(id,0,floor);
    }

}

async function generateMonster(gameID, monsterID, floor) {

    console.log(monsterID);
    let monster_list = ["none","zombie","skeleton","dragon"];
    let monster = monster_list[monsterID];
    

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `UPDATE games SET current_monster = ? WHERE ID = ?`;

    DB.query(query, [monster, gameID], function (err, result, fields) {

        if (err) throw err;

    });

}

async function getMonster(id) {

    return new Promise((resolve, reject) => {

        const DB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "frogue"
        });


        DB.connect();

        const query = `SELECT current_monster, monster_hp, monster_atk, monster_def FROM games WHERE ID = ?`;

        DB.query(query, [id], function (err, result, fields) {

            if (err) {
                reject(err);
                return;
            }
            resolve([result[0].current_monster, result[0].monster_hp, result[0].monster_atk, result[0].monster_def]);

        });
    });
}