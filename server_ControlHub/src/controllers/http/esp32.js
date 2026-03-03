const fs = require('fs').promises;
const path = require('path');

const dataFilePathOn = path.join(__dirname, '../../data/ptz_data_on.json');
const dataFilePathOff = path.join(__dirname, '../../data/ptz_data_off.json');

async function ensureFileExists(filePath) {
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify({}));
  }
}

async function readFromFile() {
  try {
    await Promise.all([ensureFileExists(dataFilePathOn), ensureFileExists(dataFilePathOff)]);

    const dataOn = JSON.parse(await fs.readFile(dataFilePathOn, 'utf-8'));
    const dataOff = JSON.parse(await fs.readFile(dataFilePathOff, 'utf-8'));

    return { data_on: dataOn, data_off: dataOff };
  } catch (error) {
    console.error('Error reading or processing files:', error);
    return { error: 'Error reading files' };
  }
}

module.exports = {
  create: (_req, res) => {
    res.status(201).send('Temperature entry created.');
  },

  read: async (_req, res) => {
    const data = await readFromFile();

    if (data.error) {
      return res.status(500).json({ message: data.error });
    }

    return res.status(200).json(data);
  },

  update: (req, res) => {
    const { id } = req.params;
    return res.status(200).send(`Temperature data with ID ${id} updated.`);
  },
};
