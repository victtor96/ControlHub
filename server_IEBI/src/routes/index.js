const express = require('express');

const tempController = require('../controllers/http/temp');
const tempRtController = require('../controllers/http/temprt');
const correnteController = require('../controllers/http/corrente');
const eixoController = require('../controllers/http/eixo');
const correnteMinutoController = require('../controllers/http/corrente_minuto');
const luzController = require('../controllers/http/luz');
const luzRtController = require('../controllers/http/luz_rt');
const esp32Controller = require('../controllers/http/esp32');

const routes = express.Router();

routes.post('/luz', luzController.create);
routes.get('/luz', luzController.read);

routes.post('/luzrt', luzRtController.create);
routes.get('/luzrt', luzRtController.read);
routes.put('/luztr/:id', luzRtController.update);

routes.get('/esp32', esp32Controller.read);

routes.post('/temperatura', tempController.create);
routes.get('/temperatura', tempController.read);

routes.post('/temprt', tempRtController.create);
routes.get('/temprt', tempRtController.read);
routes.put('/temprt/:id', tempRtController.update);

routes.post('/corrente/:id', correnteController.update);
routes.get('/corrente', correnteController.read);

routes.post('/chart', eixoController.create);
routes.get('/chart', eixoController.read);

routes.post('/corrente_minuto', correnteMinutoController.create);
routes.get('/corrente_minuto', correnteMinutoController.read);

module.exports = routes;
