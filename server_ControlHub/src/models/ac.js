const mongoose = require('mongoose');

const CORRENTE = new mongoose.Schema({
    y: Number,
    dia: String,
    hora: String
   
});

module.exports = mongoose.model('CORRENTE', CORRENTE);