const express = require('express');
const router = express.Router();

//Importation 
const playerRepo = require('../repositories/player.repo')


router.post('/', playerRepo.createPlayer);
router.get('/:id', playerRepo.getPlayerById);
router.get('/', playerRepo.getAllPlayers);
router.delete('/:id', playerRepo.deletePlayer);

module.exports = router;