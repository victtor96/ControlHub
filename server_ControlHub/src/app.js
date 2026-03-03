const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

const staticDir = path.join(__dirname, 'dist');
app.use(express.static(staticDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.use(routes);

module.exports = app;
