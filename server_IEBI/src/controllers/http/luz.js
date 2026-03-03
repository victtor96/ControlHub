const luzModel = require('../../models/luz_DB');
const { getCurrentDay, getCurrentHour } = require('../../utils/dateTime');

module.exports = {
  async read(_request, response) {
    try {
      const data = await luzModel.find();
      return response.json(data);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar dados.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Dados faltando: luminosidade.' });
    }

    const dia = getCurrentDay();
    const hora = getCurrentHour();

    try {
      const created = await luzModel.create({ dia, x: hora, y });

      console.log('Enviando dados de Luminosidade para o Mongo DB:');
      console.log(`Dia: ${dia} | Hora: ${hora} | Luminosidade: ${y}`);

      return response.json(created);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar dados.' });
    }
  },
};
