const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Liste des joueurs' });
});

router.post('/newplayer', (req, res) => {
  const newPlayer = req.body;
  console.log(newPlayer);
  const DB = mysql.createConnection({
    host: localhost,
    user: root,
    password: root,
    database: frogue
  });

  DB.connect();

  const query = `INSERT INTO players (username, userclass) VALUES (?, ?)`;
  DB.query(query, [newPlayer.get("username"), newPlayer.get("userclass")]);

  res.status(201).json({ message: 'Joueur ajouté', player: newPlayer });
});

module.exports = router;