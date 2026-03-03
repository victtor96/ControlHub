
const mongoose = require('mongoose');

const AnnotationDataSchema = new mongoose.Schema({
    x: String,
    y: Number,
    
});

module.exports = mongoose.model('axis', AnnotationDataSchema);