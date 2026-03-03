const mongoose = require('mongoose');

const CORRENTE_MINUTO = new mongoose.Schema({
    dia: String,
    x: String,
    y: Number,
   
});

module.exports = mongoose.model('CORRENTE_MIN', CORRENTE_MINUTO);