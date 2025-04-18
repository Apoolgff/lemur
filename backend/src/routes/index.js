const { Router } = require('express');
const router = Router();
const agenciaRouter = require('./apis/agencia.router');
const clienteRouter = require('./apis/cliente.router');
const cotizacionRouter = require('./apis/cotizacion.router');
const empleadoRouter = require('./apis/empleado.router');


router.use('/agencias', agenciaRouter);
router.use('/clientes', clienteRouter);
router.use('/cotizaciones', cotizacionRouter);
router.use('/empleados', empleadoRouter);


module.exports = router;
