## Visao geral

- Frontend: React + Vite
- Backend: Node.js + Express + WebSocket
- Estrutura unica para facilitar deploy, manutencao e versionamento

## Estrutura do repositorio

```text
.
|-- gui_IEBI/      # Aplicacao frontend (React + Vite)
`-- server_IEBI/   # API backend (Node.js + Express + WebSocket)
```

## Pre-requisitos

- Node.js 18+
- npm 9+

## Configuracao de ambiente

1. Backend:

```bash
cp server_IEBI/.env.example server_IEBI/.env
```

2. Frontend:

```bash
cp gui_IEBI/.env.example gui_IEBI/.env
```

## Instalacao

```bash
npm --prefix server_IEBI install
npm --prefix gui_IEBI install
```

## Execucao local

Em terminais separados, na raiz do projeto:

1. Subir backend

```bash
npm run dev:back
```

2. Subir frontend

```bash
npm run dev:front
```

## Build

Build do frontend:

```bash
npm run build:front
```

## Scripts da raiz

| Script | Descricao |
| --- | --- |
| `npm run dev:front` | Inicia o frontend em modo de desenvolvimento |
| `npm run dev:back` | Inicia o backend com nodemon |
| `npm run build:front` | Gera build de producao do frontend |
| `npm run start:back` | Inicia o backend em modo de producao |

## API e contratos

As rotas e contratos existentes foram preservados na reorganizacao.

## Publicacao no GitHub

No diretorio raiz do projeto:

```bash
git init
git add .
git commit -m "chore: reorganiza front/back e prepara repositorio"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

Se existir um repositorio Git interno em `gui_IEBI/.git`, remova-o antes do `git add .` para manter um unico repositorio no monorepo.
