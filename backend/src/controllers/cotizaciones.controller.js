const { cotizacionService, empleadoService } = require('../repositories/services');
const { configObject } = require('../../config/index');

class CotizacionController {
    constructor() {
        this.cotizacionService = cotizacionService;
        this.empleadoService = empleadoService;
    }

    // Crear nueva cotización
    createCotizacion = async (req, res) => {
        try {
            const { empleadoId, ...cotizacionData } = req.body;
            
            // Verificar que el empleado exista y pertenezca a la agencia
            const empleado = await this.empleadoService.getEmpleadoById(empleadoId);
            if (!empleado) {
                return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
            }

            const newCotizacion = await this.cotizacionService.createCotizacion({
                ...cotizacionData,
                empleado: empleadoId,
                agencia: empleado.agencia // Asignar automáticamente la agencia del empleado
            });

            res.status(201).json({
                status: 'success',
                payload: {
                    cotizacion: {
                        _id: newCotizacion._id,
                        titulo: newCotizacion.titulo,
                        detalles: newCotizacion.detalles,
                        clienteNombre: newCotizacion.clienteNombre,
                        clienteEmail: newCotizacion.clienteEmail,
                        estado: newCotizacion.estado,
                        fechaEnvio: newCotizacion.fechaEnvio,
                        empleado: {
                            _id: empleado._id,
                            nombre: empleado.nombre,
                            email: empleado.email
                        }
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener cotización por ID
    getCotizacionById = async (req, res) => {
        try {
            const cotizacionId = req.params.cid;
            const cotizacion = await this.cotizacionService.getCotizacionById(cotizacionId)
                .populate('empleado', 'nombre email puesto')
                .populate('agencia', 'nombre logo');
            
            if (!cotizacion) {
                return res.status(404).json({ status: 'error', message: 'Cotización no encontrada' });
            }

            res.status(200).json({
                status: 'success',
                payload: {
                    cotizacion: {
                        _id: cotizacion._id,
                        clienteNombre: cotizacion.clienteNombre,
                        clienteEmail: cotizacion.clienteEmail,
                        clienteTelefono: cotizacion.clienteTelefono,
                        estado: cotizacion.estado,
                        fechaEnvio: cotizacion.fechaEnvio,
                        empleado: {
                            _id: cotizacion.empleado._id,
                            nombre: cotizacion.empleado.nombre,
                            email: cotizacion.empleado.email,
                            puesto: cotizacion.empleado.puesto
                        },
                        agencia: {
                            _id: cotizacion.agencia._id,
                            nombre: cotizacion.agencia.nombre,
                            logo: cotizacion.agencia.logo
                        }
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Actualizar estado de cotización
    updateCotizacion = async (req, res) => {
        try {
            const cotizacionId = req.params.cid;
            const { estado } = req.body;

            // Validar estado permitido
            const estadosPermitidos = ['espera', 'aceptada', 'rechazada'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Estado no válido. Use: espera, aceptada o rechazada' 
                });
            }

            const updatedCotizacion = await this.cotizacionService.updateCotizacion(
                cotizacionId, 
                { estado }
            );

            if (!updatedCotizacion) {
                return res.status(404).json({ status: 'error', message: 'Cotización no encontrada' });
            }

            res.status(200).json({
                status: 'success',
                payload: {
                    cotizacion: {
                        _id: updatedCotizacion._id,
                        estado: updatedCotizacion.estado,
                        clienteNombre: updatedCotizacion.clienteNombre
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Eliminar cotización
    deleteCotizacion = async (req, res) => {
        try {
            const cotizacionId = req.params.cid;
            const result = await this.cotizacionService.deleteCotizacion(cotizacionId);
            
            if (!result) {
                return res.status(404).json({ status: 'error', message: 'Cotización no encontrada' });
            }

            res.status(200).json({ 
                status: 'success', 
                message: 'Cotización eliminada correctamente' 
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener cotizaciones por empleado
    getCotizacionesByEmpleado = async (req, res) => {
        try {
            const empleadoId = req.params.eid;
            const cotizaciones = await this.cotizacionService.getCotizacionBy({ empleado: empleadoId })
                .sort('-fechaEnvio')
                .populate('agencia', 'nombre logo');

            res.status(200).json({
                status: 'success',
                payload: {
                    cotizaciones: cotizaciones.map(cot => ({
                        _id: cot._id,
                        clienteNombre: cot.clienteNombre,
                        estado: cot.estado,
                        fechaEnvio: cot.fechaEnvio,
                        agencia: cot.agencia
                    }))
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = CotizacionController;