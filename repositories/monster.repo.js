const express = require('express');
const db = require('../data/db');
const mysql = require("mysql2");

exports.createMonster = async function createMonster(req, res) {

    try {
        const newMonster = req.body;

        const result = await db.query(
            'INSERT INTO players (name, sprite, sprite_hurt, hp, atk, def) VALUES (?, ?, ?, ?, ?, ?)',
            [newMonster.name, newMonster.sprite, newMonster.sprite_hurt, newMonster.hp, newMonster.atk, newMonster.def]
        );

        res.json({ id: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
}