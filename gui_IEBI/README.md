# IEBI Frontend (React + Vite)

Interface do projeto IEBI, reorganizada por responsabilidade:

- `src/app`: composicao principal da aplicacao
- `src/components`: layout, dashboard e componentes UI
- `src/services`: integracoes como WebSocket
- `src/config`: configuracoes de ambiente
- `src/styles`: estilos globais

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Ambiente

Crie `.env` baseado em `.env.example`:

```bash
VITE_WS_SERVER_URL=ws://192.168.0.32:4040
```
