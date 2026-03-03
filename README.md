# ControlHub Monorepo

Monorepo com frontend e backend no mesmo workspace, organizado para desenvolvimento local e publicacao no GitHub.

## Visao geral

- Frontend: React + Vite
- Backend: Node.js + Express + WebSocket
- Estrutura unica para facilitar deploy, manutencao e versionamento

## Estrutura do repositorio

```text
.
|-- gui_ControlHub/      # Aplicacao frontend (React + Vite)
`-- server_ControlHub/   # API backend (Node.js + Express + WebSocket)
```

## Pre-requisitos

- Node.js 18+
- npm 9+

## Configuracao de ambiente

1. Backend:

```bash
cp server_ControlHub/.env.example server_ControlHub/.env
```

2. Frontend:

```bash
cp gui_ControlHub/.env.example gui_ControlHub/.env
```

## Instalacao

```bash
npm --prefix server_ControlHub install
npm --prefix gui_ControlHub install
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

Se existir um repositorio Git interno em `gui_ControlHub/.git`, remova-o antes do `git add .` para manter um unico repositorio no monorepo.
