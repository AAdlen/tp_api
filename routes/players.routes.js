const express = require('express');
const mysql = require("mysql2")
const bodyParser = require('body-parser')
const router = express.Router();
let playerID = "";


router.get('/', (req, res) => {
  res.json({ message: 'Liste des joueurs' });
});

/* router.post('/newplayer', (req, res) => {
  console.log(req.body)
  res.json({ message : req.body})
}); */

router.post('/newplayer', (req, res) => {
  console.log("test")
  const newPlayer = req.body;
  console.log(newPlayer)
  console.log(newPlayer);
  const DB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "frogue"
  });
  

  DB.connect();
  const query = `INSERT INTO players (username, userclass) VALUES (?, ?)`;
  DB.query(query, [newPlayer.username, newPlayer.userclass], function(err, result, fields) {
    if (err) throw err;
    playerID = result.insertId;
    res.json({message : "Vous venez de créer le personnage numéro #" + playerID + " !"});
    console.log(playerID)
  });
});

module.exports = router;