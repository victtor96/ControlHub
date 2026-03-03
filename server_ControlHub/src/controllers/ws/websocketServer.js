const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const net = require('net');
const crypto = require('crypto');

const globalVar = require('../../state/globalVar');
const { websocketPort, esp32Ip, esp32Port } = require('../../config/env');

const wss = new WebSocket.Server({ port: websocketPort });
const clients = new Set();

let localLuz = 0;
let isNewClientOn = false;
let isNewClientOff = false;
let isSwitch1 = false;
let isSwitch2 = false;
let isSwitch3 = false;

const dataDir = path.join(__dirname, '../../data');
const switchStateFilePath = path.join(dataDir, 'switch_states.json');
const buttonFilePath = path.join(dataDir, 'buttons.json');
const modeFilePath = path.join(dataDir, 'mode.json');
const dataFilePathOn = path.join(dataDir, 'ptz_data_on.json');
const dataFilePathOff = path.join(dataDir, 'ptz_data_off.json');

function ensureFile(filePath, fallbackContent) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallbackContent, null, 2));
  }
}

ensureFile(buttonFilePath, { buttons: [] });
ensureFile(modeFilePath, { call_preset: 0x02 });
ensureFile(dataFilePathOn, {});
ensureFile(dataFilePathOff, {});

function readJson(filePath, fallbackValue) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return fallbackValue;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readButtonList() {
  const json = readJson(buttonFilePath, { buttons: [] });
  return Array.isArray(json.buttons) ? json.buttons : [];
}

function saveButtonList(newButtons) {
  writeJson(buttonFilePath, { buttons: newButtons });
}

function readMode() {
  const json = readJson(modeFilePath, { call_preset: 0x02 });
  return json.call_preset || 0x02;
}

function saveMode(value) {
  writeJson(modeFilePath, { call_preset: value });
}

let callPreset = readMode();

function loadSwitchStates() {
  const data = readJson(switchStateFilePath, null);

  if (!data) {
    return;
  }

  isSwitch1 = data.switch1 || false;
  isSwitch2 = data.switch2 || false;
  isSwitch3 = data.switch3 || false;
}

function saveSwitchStates() {
  writeJson(switchStateFilePath, {
    switch1: isSwitch1,
    switch2: isSwitch2,
    switch3: isSwitch3,
  });

  broadcast({
    type: 'initialSwitchStates',
    states: [isSwitch1, isSwitch2, isSwitch3],
  });
}

loadSwitchStates();

console.log(`Servidor WebSocket rodando na porta ${websocketPort}`);
setInterval(sendSlider, 200);

wss.on('connection', (ws) => {
  clients.add(ws);
  isNewClientOn = true;
  isNewClientOff = true;

  ws.send(JSON.stringify({
    type: 'initialSwitchStates',
    states: [isSwitch1, isSwitch2, isSwitch3],
  }));

  const buttons = readButtonList();

  if (buttons.length > 0) {
    ws.send(JSON.stringify({ type: 'buttonUpdate', buttons }));
  }

  ws.on('message', (message) => handleClientMessage(ws, message.toString()));
  ws.on('close', () => clients.delete(ws));
  ws.on('error', (error) => console.error('WebSocket error:', error.message));
});

function broadcast(data) {
  const payload = JSON.stringify(data);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
      }
    }
  });
}

function handleClientMessage(ws, message) {
  try {
    const command = JSON.parse(message);
    console.log('Mensagem recebida:', command);

    if (command.type === 'ptz' && command.id && command.control && command.value !== undefined) {
      const filePath = localLuz > 450 ? dataFilePathOn : dataFilePathOff;
      saveToFile(filePath, command.id, command.control, command.value);
      light(localLuz > 450 ? 1 : 0, command.id, command.control, command.value);
      ws.send(JSON.stringify({ status: 'Data saved successfully' }));
    } else if (command.type === 'page_loaded') {
      const hexCommand = Buffer.from([0x81, 0x22, 0xff]);
      sendHexCommand(hexCommand);
      ws.send(JSON.stringify({ status: 'Comando enviado ao ESP32 na carga da pagina' }));
    } else if (command.type === 'switchState') {
      if (typeof command.switchId === 'number') {
        const state = Boolean(command.state);

        switch (command.switchId) {
          case 1:
            isSwitch1 = state;
            break;
          case 2:
            isSwitch2 = state;
            break;
          case 3:
            isSwitch3 = state;
            break;
          default:
            break;
        }

        saveSwitchStates();
      }
    } else if (command.type === 'getInitialSwitchStates') {
      ws.send(JSON.stringify({
        type: 'initialSwitchStates',
        states: [isSwitch1, isSwitch2, isSwitch3],
      }));
    } else if (command.type === 'buttonUpdate' && Array.isArray(command.buttons)) {
      const oldButtons = readButtonList();
      const newButtons = command.buttons;

      const modified =
        oldButtons.length !== newButtons.length ||
        oldButtons.some((button, index) => button !== newButtons[index]);

      if (modified) {
        saveButtonList(newButtons);
        broadcast({ type: 'buttonUpdate', buttons: newButtons });
        ws.send(JSON.stringify({ status: 'Botoes atualizados com sucesso' }));
      } else {
        ws.send(JSON.stringify({ status: 'Nenhuma alteracao nos botoes' }));
      }
    } else if (command.type === 'modeChange') {
      let newMode = callPreset;

      if (command.mode === 'PRESET') {
        newMode = 0x01;
      } else if (command.mode === 'CALL') {
        newMode = 0x02;
      }

      if (newMode !== callPreset) {
        callPreset = newMode;
        saveMode(callPreset);
        broadcast({ type: 'modeChanged', call_preset: callPreset });
      }

      ws.send(JSON.stringify({
        status: `CALL_PRESET atualizado para ${callPreset === 0x01 ? 'PRESET' : 'CALL'}`,
      }));
    } else if (command.type === 'getCallPreset') {
      ws.send(JSON.stringify({ type: 'modeChanged', call_preset: callPreset }));
    } else {
      ws.send(JSON.stringify({ status: 'Invalid message format' }));
    }

    handlePresetCommand(command);
  } catch (error) {
    console.error('Erro ao processar mensagem do cliente:', error.message);
  }
}

function handlePresetCommand(command) {
  if (command.type !== 'buttonAction') {
    return;
  }

  const buffer = Buffer.from([0x81, 0x01, 0x04, 0x3f, callPreset, 15 + command.buttonId, 0xff]);

  if (isSwitch1) {
    sendHexCommandPtz(buffer, '192.168.0.11', 1259);
  }

  if (isSwitch2) {
    sendHexCommandPtz(buffer, '192.168.0.13', 1259);
  }

  if (isSwitch3) {
    sendHexCommandPtz(buffer, '192.168.0.14', 1259);
  }
}

function light(lightValue, camera, control, value) {
  const commands = {
    iris: 0x91,
    gain: 0x92,
    contraste: 0x93,
  };

  if (commands[control]) {
    sendHexCommand(Buffer.from([0x81, 0x11, lightValue, camera, commands[control], 0x00, value, 0xff]));
  }
}

function sendHexCommand(hexCommand) {
  const client = net.createConnection({ host: esp32Ip, port: esp32Port }, () => {
    console.log(`Enviando hex: ${hexCommand.toString('hex')}`);
    client.write(hexCommand);
  });

  client.setTimeout(5000);
  client.on('timeout', () => client.end());
  client.on('data', () => client.end());
  client.on('error', (error) => console.error(`Erro: ${error.message}`));
  client.on('end', () => console.log('Desconectado do ESP32'));
}

function sendHexCommandPtz(hexCommand, host, port) {
  const client = net.createConnection({ host, port }, () => {
    console.log(`Enviando hex: ${hexCommand.toString('hex')} para ${host}`);
    client.write(hexCommand);
  });

  client.setTimeout(5000);
  client.on('timeout', () => client.end());
  client.on('data', () => client.end());
  client.on('error', (error) => console.error(`Erro: ${error.message}`));
  client.on('end', () => console.log('Desconectado do PTZ'));
}

function saveToFile(filePath, id, control, value) {
  try {
    const data = readJson(filePath, {});

    if (!data[id]) {
      data[id] = {};
    }

    data[id][control] = value;
    writeJson(filePath, data);
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error.message);
  }
}

function readFromFile() {
  const filePath = localLuz > 450 ? dataFilePathOn : dataFilePathOff;
  return readJson(filePath, {});
}

let previousHash = '';

function checkAndSendBroadcast() {
  const filePath = localLuz > 450 ? dataFilePathOn : dataFilePathOff;
  const currentHash = calculateFileHash(filePath);

  if (currentHash !== previousHash || (localLuz > 450 ? isNewClientOn : isNewClientOff)) {
    previousHash = currentHash;
    broadcast(readFromFile());

    if (localLuz > 450) {
      isNewClientOn = false;
    } else {
      isNewClientOff = false;
    }
  }
}

function calculateFileHash(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
  } catch (error) {
    console.error('Erro ao calcular hash:', error.message);
    return '';
  }
}

function sendSlider() {
  try {
    localLuz = globalVar.get();
    checkAndSendBroadcast();
  } catch (error) {
    console.error('Erro ao atualizar slider:', error.message);
  }
}

module.exports = { broadcast };
