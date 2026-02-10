const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})