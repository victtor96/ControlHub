const mongoose = require('mongoose');

const LUZ = new mongoose.Schema({
    dia: String,
    x: String,
    y: Number,
   
});

module.exports = mongoose.model('luz_RT', LUZ);