const luzRtModel = require('../../models/luzRT_DB');
const { broadcast } = require('../ws/websocketServer');
const globalVar = require('../../state/globalVar');
const { getCurrentDay, getCurrentHour } = require('../../utils/dateTime');

let localLuz = 0;

function updateBackgroundColor() {
  const backgrounds = localLuz > 1000
    ? [
        { key: 'backgroundCard1', color: '#D0D7E7' },
        { key: 'backgroundCard', color: '#B2C1DC' },
      ]
    : [
        { key: 'backgroundCard1', color: '#1F1F22' },
        { key: 'backgroundCard', color: '#101015' },
      ];

  backgrounds.forEach((background) => {
    broadcast({
      type: 'backgroundColor',
      key: background.key,
      backgroundColor: background.color,
    });
  });
}

module.exports = {
  async read(_request, response) {
    try {
      const data = await luzRtModel.find();
      return response.json(data);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar os dados.' });
    }
  },

  async create(request, response) {
    const { y } = request.body;

    if (y == null || typeof y !== 'number' || y < -10) {
      return response.status(400).json({ error: 'Luminosidade invalida.' });
    }

    const hora = getCurrentHour();

    try {
      const created = await luzRtModel.create({
        dia: getCurrentDay(),
        x: hora,
        y,
      });

      console.log(`Hora: ${hora}, Luminosidade: ${y}`);
      return response.json(created);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao salvar os dados.' });
    }
  },

  async update(request, response) {
    const { id } = request.params;
    const { y } = request.body;

    if (y == null || typeof y !== 'number' || y < -10) {
      return response.status(400).json({ error: 'Luminosidade invalida.' });
    }

    localLuz = y;
    globalVar.set(localLuz);
    updateBackgroundColor();

    try {
      const updated = await luzRtModel.findByIdAndUpdate(id, { y }, { new: true });

      if (!updated) {
        return response.status(404).json({ error: 'Registro nao encontrado.' });
      }

      console.log(`Atualizado: ID: ${id}, Nova Luminosidade: ${y}`);
      return response.json(updated);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar os dados.' });
    }
  },
};
