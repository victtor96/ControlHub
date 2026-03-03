#Frontend + Backend

Estrutura reorganizada para manter frontend e backend no mesmo workspace, pronta para subir no GitHub.

## Estrutura

- `gui_IEBI/`: frontend React + Vite
- `server_IEBI/`: backend Node.js + Express + WebSocket

## Pre-requisitos

- Node.js 18+
- npm 9+

## Configuracao de ambiente

1. Backend:
   - copie `server_IEBI/.env.example` para `server_IEBI/.env`
2. Frontend:
   - copie `gui_IEBI/.env.example` para `gui_IEBI/.env`

## Executar localmente

Backend:

```bash
npm --prefix server_IEBI install
npm run dev:back
```

Frontend:

```bash
npm --prefix gui_IEBI install
npm run dev:front
```

## Build do frontend

```bash
npm run build:front
```

## Endpoints e contratos

As rotas e contratos existentes foram mantidos.

## Subir no GitHub

No diretorio raiz `/home/victor/code/server_IEBI`:

```bash
git init
git add .
git commit -m "chore: reorganiza front/back e prepara repositorio"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

Se voce quiser versionar tudo em um unico repositorio e o frontend ja tiver um `.git` interno em `gui_IEBI/.git`, remova esse `.git` interno antes do `git add .` na raiz.
