const { Router } = require('express');
const ClienteController = require('../../controllers/clientes.controller');
const { verifyToken } = require('../../utils/jwt');

const clienteRouter = Router();
const clienteController = new ClienteController();

// Rutas públicas
clienteRouter.post('/', clienteController.createCliente);

// Rutas protegidas (requieren autenticación)
clienteRouter.get('/:cid', verifyToken, clienteController.getClienteById);
clienteRouter.put('/:cid', verifyToken, clienteController.updateCliente);
clienteRouter.delete('/:cid', verifyToken, clienteController.deleteCliente);
clienteRouter.get('/:cid/cotizaciones', verifyToken, clienteController.getClienteCotizaciones);

module.exports = clienteRouter;