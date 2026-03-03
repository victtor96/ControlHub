const axisModel = require('../../models/axis');
const { getCurrentHour } = require('../../utils/dateTime');

module.exports = {
  async read(_request, response) {
    try {
      const data = await axisModel.find();
      return response.json(data);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar dados de eixo.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Sem dados.' });
    }

    const x = getCurrentHour();

    try {
      const created = await axisModel.create({ x, y });

      console.log('Enviando dados de eixo para o Mongo DB:');
      console.log(`Hora: ${x}  Corrente: ${y}`);

      return response.json(created);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao salvar dados de eixo.' });
    }
  },
};
