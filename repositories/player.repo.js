const express = require('express');
const db = require('../data/db');
const mysql = require("mysql2");
const playerService = require('../services/players.service');

//Creation du joueur
exports.createPlayer = async function createPlayer(req, res) {

    try {
        const newPlayer = req.body;

        const result = await db.query(
            'INSERT INTO players (username, userclass, maxhp, hp, str, `int`, def, speed, luck) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newPlayer.username, newPlayer.userclass, newPlayer.hp, newPlayer.hp, newPlayer.str, newPlayer.int, newPlayer.def, newPlayer.speed, newPlayer.luck]
        );

        res.json({ id: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
}

//Affichage du joueur depuis son ID
exports.getPlayerById = async function getPlayerById(req, res) {

    try {
        const player = await playerService.getPlayer(req.params.id);

        if (!player) {
            return res.status(404).send("Player not found");
        }

        res.json(player);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }

}


//Affichage de tous les joueurs
exports.getAllPlayers = async function getAllPlayers(req, res) {

    try {
        const players = await db.query('SELECT * FROM players');
        res.json(players);

    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
}

//Suppression du joueur avec son ID
exports.deletePlayer = async function deletePlayer(req, res) {

    try {
        const playerID = req.params.id;

        await db.query(`
            UPDATE players
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
            WHERE ID = ?
        `, [playerID]);

        res.json({
            message: `Vous venez de supprimer le personnage numéro #${playerID} !`
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }

}
