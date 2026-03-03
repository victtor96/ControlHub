const app = require('./app');
const { connectDatabase } = require('./config/database');
const {
  appPort,
  networkTestHost,
  networkTestPort,
  networkRetryMs,
} = require('./config/env');
const { checkTcpConnection, sleep } = require('./utils/network');

async function waitForNetwork() {
  let hasConnection = false;

  while (!hasConnection) {
    hasConnection = await checkTcpConnection(networkTestHost, networkTestPort);

    if (!hasConnection) {
      console.log('Sem conexao de rede. Tentando novamente em 5 segundos...');
      await sleep(networkRetryMs);
    }
  }
}

async function startServer() {
  await connectDatabase();
  await waitForNetwork();

  app.listen(appPort, () => {
    console.log(`Servidor HTTP rodando na porta ${appPort}`);
  });
}

startServer().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error.message);
  process.exit(1);
});
