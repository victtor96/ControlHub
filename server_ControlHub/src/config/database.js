const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectDatabase() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI nao configurada no ambiente.');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB conectado com sucesso.');
}

module.exports = { connectDatabase };
