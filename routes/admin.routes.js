const express = require('express');
const router = express.Router();

//Importation 
const repoMonster = require('../repositories/monster.repo')

router.post('/monsters', repoMonster.createMonster);
router.get('/monsters/:id', repoMonster.getMonsterById);

module.exports = router;