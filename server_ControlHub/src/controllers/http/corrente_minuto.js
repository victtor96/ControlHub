const correnteMinutoModel = require('../../models/corrente_min');
const { getCurrentDay, getCurrentHour } = require('../../utils/dateTime');

module.exports = {
  async read(_request, response) {
    try {
      const data = await correnteMinutoModel.find();
      return response.json(data);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar corrente por minuto.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Sem dados.' });
    }

    const hora = getCurrentHour();

    try {
      const created = await correnteMinutoModel.create({
        dia: getCurrentDay(),
        x: hora,
        y,
      });

      console.log('Enviando dados de Corrente para o Mongo DB:');
      console.log(`Hora: ${hora}  Corrente: ${y}`);

      return response.json(created);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao salvar corrente por minuto.' });
    }
  },
};
