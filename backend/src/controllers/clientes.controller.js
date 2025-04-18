const { clienteService } = require('../repositories/services');
const { configObject } = require('../../config/index');

class ClienteController {
    constructor() {
        this.clienteService = clienteService;
    }

    // Crear nuevo cliente
    createCliente = async (req, res) => {
        try {
            const { email } = req.body;
            
            // Verificar si el cliente ya existe
            const exists = await this.clienteService.getClienteBy({ email });
            if (exists) return res.status(400).json({ status: 'error', message: 'El cliente ya existe' });

            const newCliente = await this.clienteService.createCliente(req.body);

            res.status(201).json({
                status: 'success',
                payload: {
                    cliente: {
                        _id: newCliente._id,
                        nombre: newCliente.nombre,
                        apellido: newCliente.apellido,
                        email: newCliente.email,
                        telefono: newCliente.telefono
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener cliente por ID
    getClienteById = async (req, res) => {
        try {
            const clienteId = req.params.cid;
            const cliente = await this.clienteService.getClienteById(clienteId);
            
            if (!cliente) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });

            res.status(200).json({
                status: 'success',
                payload: {
                    cliente: {
                        _id: cliente._id,
                        nombre: cliente.nombre,
                        apellido: cliente.apellido,
                        email: cliente.email,
                        telefono: cliente.telefono,
                        cotizacionesRecibidas: cliente.cotizacionesRecibidas
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Actualizar cliente
    updateCliente = async (req, res) => {
        try {
            const clienteId = req.params.cid;
            const updatedFields = req.body;

            // No permitir actualización de email (podría ser único)
            if (updatedFields.email) {
                return res.status(400).json({ status: 'error', message: 'No se puede modificar el email' });
            }

            const updatedCliente = await this.clienteService.updateCliente(clienteId, updatedFields);
            
            if (!updatedCliente) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });

            res.status(200).json({
                status: 'success',
                payload: {
                    cliente: {
                        _id: updatedCliente._id,
                        nombre: updatedCliente.nombre,
                        apellido: updatedCliente.apellido,
                        email: updatedCliente.email,
                        telefono: updatedCliente.telefono
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Eliminar cliente
    deleteCliente = async (req, res) => {
        try {
            const clienteId = req.params.cid;
            const result = await this.clienteService.deleteCliente(clienteId);
            
            if (!result) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });

            res.status(200).json({ 
                status: 'success', 
                message: 'Cliente eliminado correctamente' 
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener todas las cotizaciones de un cliente
    getClienteCotizaciones = async (req, res) => {
        try {
            const clienteId = req.params.cid;
            const cliente = await this.clienteService.getClienteById(clienteId).populate('cotizacionesRecibidas');
            
            if (!cliente) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });

            res.status(200).json({
                status: 'success',
                payload: {
                    cotizaciones: cliente.cotizacionesRecibidas
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = ClienteController;