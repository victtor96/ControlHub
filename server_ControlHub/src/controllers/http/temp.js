const temperaturaModel = require('../../models/temperatura');
const { getCurrentDay, getCurrentHour } = require('../../utils/dateTime');

module.exports = {
  async read(_request, response) {
    try {
      const data = await temperaturaModel.find();
      return response.json(data);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
      return response.status(500).json({ error: 'Erro ao buscar os dados.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Temperatura nao fornecida.' });
    }

    const data = getCurrentDay();
    const x = getCurrentHour();

    try {
      let currentDayEntry = await temperaturaModel.findOne({ data });

      if (currentDayEntry) {
        currentDayEntry.valores.push({ x, y });
        await currentDayEntry.save();
      } else {
        currentDayEntry = await temperaturaModel.create({ data, valores: [{ x, y }] });
      }

      console.log('Dados de Temperatura enviados para o MongoDB:');
      console.log(`Data: ${data} | Hora: ${x} | Temperatura: ${y}`);

      return response.json(currentDayEntry);
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      return response.status(500).json({ error: 'Erro ao salvar os dados.' });
    }
  },
};
