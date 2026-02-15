const express = require('express');
const mysql = require("mysql2");

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
    

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `UPDATE games SET current_floor = ? WHERE ID = ?`;

    DB.query(query, [currentFloor+1, gameID], function (err, result, fields) {

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

        if (err){
            reject(err);
            return;
        } 
        resolve(result[0].current_floor);

    });
 });
}