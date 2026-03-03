const net = require('net');

function checkTcpConnection(host, port, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);

    socket
      .connect(port, host, () => {
        socket.destroy();
        resolve(true);
      })
      .on('error', () => {
        socket.destroy();
        resolve(false);
      })
      .on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  checkTcpConnection,
  sleep,
};
