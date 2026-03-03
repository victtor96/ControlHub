const correnteModel = require('../../models/ac');
const { getCurrentDay, getCurrentHour } = require('../../utils/dateTime');

module.exports = {
  async read(_request, response) {
    try {
      const data = await correnteModel.find();
      return response.json(data);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar corrente.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Sem dados.' });
    }

    try {
      const created = await correnteModel.create({
        y,
        dia: getCurrentDay(),
        hora: getCurrentHour(),
      });

      return response.json(created);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao salvar corrente.' });
    }
  },

  async update(request, response) {
    const { id } = request.params;
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Sem dados.' });
    }

    try {
      const current = await correnteModel.findById(id);

      if (!current) {
        return response.status(404).json({ error: 'Registro nao encontrado.' });
      }

      current.y = y;
      await current.save();

      return response.json(current);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar corrente.' });
    }
  },
};
