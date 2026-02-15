const express = require('express');
const router = express.Router();

//Importation 
const repoPlayer = require('../repositories/player.repo')


router.post('/', repoPlayer.createPlayer);
router.get('/:id', repoPlayer.getPlayer);
router.get('/', repoPlayer.getAllPlayers);
router.delete('/:id', repoPlayer.deletePlayer);



module.exports = router;