const express = require('express');
const db = require('../data/db');
const mysql = require("mysql2");
const gamesService = require('../services/games.service');

exports.createMonster = async function createMonster(req, res) {

    try {
        const newMonster = req.body;

        const result = await db.query(
            'INSERT INTO monsters (name, sprite, sprite_hurt, hp, atk, def) VALUES (?, ?, ?, ?, ?, ?)',
            [newMonster.name, newMonster.sprite, newMonster.spriteHurt, newMonster.hp, newMonster.atk, newMonster.def]
        );

        res.json({ id: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
}

exports.getMonsterById = async function getMonsterById(req, res) {

    try {
        const monster = await gamesService.getMonster(req.params.id);

        if (!monster) {
            return res.status(404).send("Monster not found");
        }

        res.json(monster);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }

}