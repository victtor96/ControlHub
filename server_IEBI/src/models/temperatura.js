const mongoose = require('mongoose');

// Esquema atualizado para armazenar temperaturas por data
const AnnotationDataSchema = new mongoose.Schema({
    data: {
        type: String, // Data no formato "DD/MM/YYYY"
        required: true
    },
    valores: [
        {
            x: String, // Hora no formato "HH:mm"
            y: Number  // Temperatura
        }
    ]
});

module.exports = mongoose.model('Temperatura', AnnotationDataSchema);