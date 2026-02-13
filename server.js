const express = require('express')
const mysql = require("mysql2")
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());

const playersRoutes = require('./routes/players.routes');
const gamesRoutes = require('./routes/games.routes');

app.use('/players', playersRoutes);
app.use('/game', gamesRoutes);


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) 