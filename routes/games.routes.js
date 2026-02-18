const express = require('express');
const router = express.Router();

//Importation 
const repoGames = require('../repositories/game.repo')


router.post('/:id', repoGames.createGame);
router.get('/:id', repoGames.getGameById);
router.post('/:id/move', repoGames.move);
router.post('/:id/attack', repoGames.attack);

module.exports = router;