const express = require('express');
const router = express.Router();

//Importation 
const repoGames = require('../repositories/game.repo')


router.post('/:id', repoGames.createGame);
router.get('/:id', repoGames.getGame);
router.post('/:id/move', repoGames.move);

module.exports = router;