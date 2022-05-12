const Router = require('express').Router()

const ServicosController = require('../controllers/ServicosController')

Router.get('/servicos', ServicosController.Get);
Router.post('/servicos', ServicosController.Post);
Router.delete('/servicos/:id', ServicosController.Delete);

module.exports = Router;