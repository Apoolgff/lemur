const { Router } = require('express');
const CotizacionController = require('../../controllers/cotizaciones.controller');
const { verifyToken } = require('../../utils/jwt');

const cotizacionRouter = Router();
const cotizacionController = new CotizacionController();

// Rutas protegidas (requieren autenticación)
cotizacionRouter.post('/', verifyToken, cotizacionController.createCotizacion);
cotizacionRouter.get('/:cid', verifyToken, cotizacionController.getCotizacionById);
cotizacionRouter.patch('/:cid/estado', verifyToken, cotizacionController.updateCotizacion);
cotizacionRouter.delete('/:cid', verifyToken, cotizacionController.deleteCotizacion);
cotizacionRouter.get('/empleado/:eid', verifyToken, cotizacionController.getCotizacionesByEmpleado);

module.exports = cotizacionRouter;