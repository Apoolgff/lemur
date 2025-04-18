const { Router } = require('express');
const EmpleadoController = require('../../controllers/empleados.controller');
const { verifyToken } = require('../../utils/jwt');
const { isAgencia } = require('../../middlewares/authorization');

const empleadoRouter = Router();
const empleadoController = new EmpleadoController();

// Rutas públicas
empleadoRouter.post('/login', empleadoController.loginEmpleado);

// Rutas protegidas para agencias
empleadoRouter.post('/register', verifyToken, isAgencia, empleadoController.registerEmpleado);
empleadoRouter.get('/agencia', verifyToken, isAgencia, empleadoController.getEmpleadosByAgencia);
empleadoRouter.put('/:eid', verifyToken, isAgencia, empleadoController.updateEmpleadoByAgencia);
empleadoRouter.delete('/:eid', verifyToken, isAgencia, empleadoController.deleteEmpleado);

// Rutas protegidas para empleados
empleadoRouter.get('/profile', verifyToken, empleadoController.getProfile);
empleadoRouter.patch('/profile', verifyToken, empleadoController.updateProfile);

module.exports = empleadoRouter;