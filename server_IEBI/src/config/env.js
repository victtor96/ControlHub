const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  appPort: parseNumber(process.env.PORT, 3000),
  mongoUri: process.env.MONGODB_URI || '',
  websocketPort: parseNumber(process.env.WEBSOCKET_PORT, 4040),
  esp32Ip: process.env.ESP32_IP || '192.168.0.33',
  esp32Port: parseNumber(process.env.ESP32_PORT, 3333),
  networkTestHost: process.env.NETWORK_TEST_HOST || '192.168.0.1',
  networkTestPort: parseNumber(process.env.NETWORK_TEST_PORT, 80),
  networkRetryMs: parseNumber(process.env.NETWORK_RETRY_MS, 5000),
};
