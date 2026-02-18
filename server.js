const express = require('express')
const mysql = require("mysql2")
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());

const playersRoutes = require('./routes/players.routes');
const gamesRoutes = require('./routes/games.routes');
const adminRoutes = require('./routes/admin.routes')
const { classes } = require('./data/classes');

app.get("/classes", (req, res) => {
    res.json(classes);
});

app.use('/players', playersRoutes);
app.use('/games', gamesRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) 