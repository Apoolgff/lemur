const { empleadoService, agenciaService } = require('../repositories/services');
const { createHash, isValidPassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');
const { configObject } = require('../../config/index');

class EmpleadoController {
    constructor() {
        this.empleadoService = empleadoService;
        this.agenciaService = agenciaService;
    }

    // Registro de empleado por agencia
    registerEmpleado = async (req, res) => {
        try {
            const agenciaId = req.user._id; // ID de la agencia que registra
            const { password, ...empleadoData } = req.body;

            // Validar que la agencia exista
            const agencia = await this.agenciaService.getAgenciaById(agenciaId);
            if (!agencia) {
                return res.status(404).json({ status: 'error', message: 'Agencia no encontrada' });
            }

            // Verificar si el email ya está registrado
            const exists = await this.empleadoService.getEmpleadoBy({ email: empleadoData.email });
            if (exists) {
                return res.status(400).json({ status: 'error', message: 'El email ya está registrado' });
            }

            // Crear hash de la contraseña
            const hashedPassword = await createHash(password);

            const newEmpleado = await this.empleadoService.createEmpleado({
                ...empleadoData,
                agencia: agenciaId,
                password: hashedPassword
            });

            // Actualizar lista de empleados en la agencia
            await this.agenciaService.updateAgencia(agenciaId, {
                $push: { usuarios: newEmpleado._id }
            });

            res.status(201).json({
                status: 'success',
                payload: {
                    empleado: {
                        _id: newEmpleado._id,
                        nombre: newEmpleado.nombre,
                        email: newEmpleado.email,
                        puesto: newEmpleado.puesto
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Login de empleado
    loginEmpleado = async (req, res) => {
        try {
            const { email, password } = req.body;

            const empleado = await this.empleadoService.getEmpleadoBy({ email }).select('+password');
            if (!empleado) {
                return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
            }

            const validPassword = await isValidPassword(password, empleado.password);
            if (!validPassword) {
                return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
            }

            const token = generateToken(empleado);

            res.cookie(configObject.cookie_name, token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000 // 1 hora
            });

            res.status(200).json({
                status: 'success',
                payload: {
                    empleado: {
                        _id: empleado._id,
                        nombre: empleado.nombre,
                        email: empleado.email,
                        puesto: empleado.puesto
                    },
                    token
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener perfil del empleado (para el propio empleado)
    getProfile = async (req, res) => {
        try {
            const empleado = await this.empleadoService.getEmpleadoById(req.user._id);
            
            if (!empleado) {
                return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
            }

            res.status(200).json({
                status: 'success',
                payload: {
                    empleado: {
                        _id: empleado._id,
                        nombre: empleado.nombre,
                        apellido: empleado.apellido,
                        email: empleado.email,
                        telefono: empleado.telefono,
                        puesto: empleado.puesto,
                        foto: empleado.foto,
                        cotizacionesEnviadas: empleado.cotizacionesEnviadas,
                        conversiones: empleado.conversiones
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Actualizar perfil (para el empleado)
    updateProfile = async (req, res) => {
        try {
            const empleadoId = req.user._id;
            const allowedFields = ['nombre', 'apellido', 'telefono', 'foto'];
            const updateData = {};
            
            // Filtrar solo campos permitidos
            Object.keys(req.body).forEach(key => {
                if (allowedFields.includes(key)) {
                    updateData[key] = req.body[key];
                }
            });

            const updatedEmpleado = await this.empleadoService.updateEmpleado(empleadoId, updateData);
            
            if (!updatedEmpleado) {
                return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
            }

            res.status(200).json({
                status: 'success',
                payload: {
                    empleado: {
                        _id: updatedEmpleado._id,
                        nombre: updatedEmpleado.nombre,
                        apellido: updatedEmpleado.apellido,
                        telefono: updatedEmpleado.telefono,
                        foto: updatedEmpleado.foto
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener empleados de la agencia (para la agencia)
    getEmpleadosByAgencia = async (req, res) => {
        try {
            const agenciaId = req.user._id;
            const empleados = await this.empleadoService.getEmpleadoBy({ agencia: agenciaId })
                .select('-password -__v');

            res.status(200).json({
                status: 'success',
                payload: {
                    empleados
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Actualizar empleado (para la agencia)
    updateEmpleadoByAgencia = async (req, res) => {
        try {
            const { eid } = req.params;
            const agenciaId = req.user._id;

            // Verificar que el empleado pertenezca a la agencia
            const empleado = await this.empleadoService.getEmpleadoById(eid);
            if (!empleado || empleado.agencia.toString() !== agenciaId.toString()) {
                return res.status(403).json({ status: 'error', message: 'No autorizado' });
            }

            // Campos no modificables por seguridad
            const { email, password, agencia, ...updateData } = req.body;

            const updatedEmpleado = await this.empleadoService.updateEmpleado(eid, updateData);
            
            if (!updatedEmpleado) {
                return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
            }

            res.status(200).json({
                status: 'success',
                payload: {
                    empleado: {
                        _id: updatedEmpleado._id,
                        nombre: updatedEmpleado.nombre,
                        puesto: updatedEmpleado.puesto,
                        cotizacionesEnviadas: updatedEmpleado.cotizacionesEnviadas,
                        conversiones: updatedEmpleado.conversiones
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Eliminar empleado (para la agencia)
    deleteEmpleado = async (req, res) => {
        try {
            const { eid } = req.params;
            const agenciaId = req.user._id;

            // Verificar que el empleado pertenezca a la agencia
            const empleado = await this.empleadoService.getEmpleadoById(eid);
            if (!empleado || empleado.agencia.toString() !== agenciaId.toString()) {
                return res.status(403).json({ status: 'error', message: 'No autorizado' });
            }

            // Eliminar empleado
            const result = await this.empleadoService.deleteEmpleado(eid);
            
            // Eliminar referencia en la agencia
            await this.agenciaService.updateAgencia(agenciaId, {
                $pull: { usuarios: eid }
            });

            res.status(200).json({ 
                status: 'success', 
                message: 'Empleado eliminado correctamente' 
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = EmpleadoController;