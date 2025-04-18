const { Router } = require('express');
const AgenciaController = require('../../controllers/agencias.controller');
const { verifyToken } = require('../../utils/jwt');

const agenciaRouter = Router();
const agenciaController = new AgenciaController();

// Rutas públicas
agenciaRouter.post('/register', agenciaController.register);
agenciaRouter.post('/login', agenciaController.login);

// Rutas protegidas
agenciaRouter.get('/perfil', verifyToken, agenciaController.getProfile);
agenciaRouter.put('/perfil', verifyToken, agenciaController.updateProfile);
agenciaRouter.delete('/perfil', verifyToken, agenciaController.deleteAccount);
agenciaRouter.get('/empleados', verifyToken, agenciaController.getEmployees);

// Ruta de admin (opcional)
agenciaRouter.get('/', verifyToken, agenciaController.getAllAgencies);

module.exports = agenciaRouter;