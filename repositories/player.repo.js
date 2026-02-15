const express = require('express');
const mysql = require("mysql2");

//Creation du joueur
exports.createPlayer = async function createPlayer(req, res) {

    const newPlayer = req.body;

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `INSERT INTO players (username, userclass) VALUES (?, ?)`;

    DB.query(query, [newPlayer.username, newPlayer.userclass], function (err, result, fields) {

        if (err) throw err;
        playerID = result.insertId;
        res.json({ id: playerID });

    });

}

//Affichage du joueur depuis son ID
exports.getPlayer = async function getPlayer(req, res) {

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `SELECT * FROM players WHERE ID = ?`;

    DB.query(query, [req.params.id], function (err, result, fields) {

        if (err) throw err;
        res.send(result);
    }); 

}


//Affichage de tous les joueurs
exports.getAllPlayers = async function getAllPlayers(req, res) {

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `SELECT * FROM players`;

    DB.query(query, function (err, result, fields) {

        if (err) throw err;
        res.send(result);
    }); 

}

//Suppression du joueur avec son ID
exports.deletePlayer = async function deletePlayer(req, res) {

    const DB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "frogue"
    });


    DB.connect();

    const query = `UPDATE players
    SET
     username = 'deleted_user',
     avatar = '',
     maxhp = 0,
     hp = 0,
     str = 0,
     \`int\` = 0,
     def = 0,
     speed = 0,
     luck = 0,
     deleted = 'yes'
    WHERE ID = ?`;

    DB.query(query, [req.params.id], function (err, result, fields) {

        if (err) throw err;
        playerID = req.params.id;
        res.json({ message: "Vous venez de supprimer le personnage numéro #" + playerID + " !" });

    });

}
