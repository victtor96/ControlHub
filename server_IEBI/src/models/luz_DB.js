const mongoose = require('mongoose');

const luzSchema = new mongoose.Schema({
  dia: String,
  x: String,
  y: Number,
});

module.exports = mongoose.model('luz', luzSchema);
