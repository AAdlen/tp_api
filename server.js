const express = require('express')
const mysql = require("mysql2")
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());

const playersRoutes = require('./routes/players.routes');

app.use('/players', playersRoutes);

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/items/:id', (req, res) => {
    const id = req.params.id;
  res.json({ items: `Ceci est l'item ${id} !` });
});

///

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})