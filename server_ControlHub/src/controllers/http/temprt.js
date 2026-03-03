const temperaturaRtModel = require('../../models/temperatura_RT');
const { broadcast } = require('../ws/websocketServer');
const { getCurrentDay, getCurrentHour } = require('../../utils/dateTime');

let localTemp = 0;

function sendTemperature() {
  broadcast({
    type: 'temperature',
    key: 'Temperature_RT',
    temp_send: localTemp,
  });
}

module.exports = {
  async read(_request, response) {
    try {
      const data = await temperaturaRtModel.find();
      return response.json(data);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar os dados.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Temperatura nao fornecida.' });
    }

    const hora = getCurrentHour();

    try {
      const created = await temperaturaRtModel.create({
        dia: getCurrentDay(),
        x: hora,
        y,
      });

      console.log(`Hora: ${hora}, Temperatura: ${y}`);
      return response.json(created);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao salvar os dados.' });
    }
  },

  async update(request, response) {
    const { id } = request.params;
    const { y } = request.body;

    if (y == null) {
      return response.status(400).json({ error: 'Temperatura nao fornecida.' });
    }

    localTemp = y;
    sendTemperature();

    try {
      const updated = await temperaturaRtModel.findByIdAndUpdate(id, { y }, { new: true });

      if (!updated) {
        return response.status(404).json({ error: 'Registro nao encontrado.' });
      }

      console.log(`Atualizado: ID: ${id}, Nova Temperatura: ${y}`);
      return response.json(updated);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar os dados.' });
    }
  },
};
