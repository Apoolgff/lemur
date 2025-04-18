const { agenciaService } = require('../repositories/services');
const { configObject } = require('../../config/index');
const { createHash, isValidPassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');

class AgenciaController {
    constructor() {
        this.agenciaService = agenciaService;
    }

    // Registro de nueva agencia
    register = async (req, res) => {
        try {
            const { password, ...agenciaData } = req.body;
            
            const exists = await this.agenciaService.getAgenciaBy({ email: agenciaData.email });
            if (exists) return res.status(400).json({ status: 'error', message: 'La agencia ya existe' });

            const hashedPassword = await createHash(password);
            
            const newAgencia = await this.agenciaService.createAgencia({
                ...agenciaData,
                password: hashedPassword
            });

            const token = generateToken(newAgencia);

            res.cookie(configObject.cookie_name, token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            });

            res.status(201).json({
                status: 'success',
                payload: {
                    agencia: {
                        _id: newAgencia._id,
                        nombre: newAgencia.nombre,
                        email: newAgencia.email,
                        nivel: newAgencia.nivel
                    },
                    token
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Login de agencia
    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const agencia = await this.agenciaService.getAgenciaBy({ email });
            if (!agencia) return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });

            const validPassword = await isValidPassword(password, agencia.password);
            if (!validPassword) return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });

            const token = generateToken(agencia);

            res.cookie(configObject.cookie_name, token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            });

            res.status(200).json({
                status: 'success',
                payload: {
                    agencia: {
                        _id: agencia._id,
                        nombre: agencia.nombre,
                        email: agencia.email,
                        nivel: agencia.nivel
                    },
                    token
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Logout
    logout = async (req, res) => {
        try {
            res.clearCookie(configObject.cookie_name);
            res.status(200).json({ status: 'success', message: 'Sesión cerrada correctamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener perfil de la agencia
    getProfile = async (req, res) => {
        try {
            const agencia = await this.agenciaService.getAgenciaById(req.user._id);
            if (!agencia) return res.status(404).json({ status: 'error', message: 'Agencia no encontrada' });

            res.status(200).json({
                status: 'success',
                payload: {
                    agencia: {
                        _id: agencia._id,
                        nombre: agencia.nombre,
                        email: agencia.email,
                        web: agencia.web,
                        redes: agencia.redes,
                        telefonos: agencia.telefonos,
                        direccion: agencia.direccion,
                        logo: agencia.logo,
                        nivel: agencia.nivel,
                        usuarios: agencia.usuarios
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Actualizar perfil de la agencia
    updateProfile = async (req, res) => {
        try {
            const { password, ...updateData } = req.body;
            const agenciaId = req.user._id;

            if (password) {
                updateData.password = await createHash(password);
            }

            const updatedAgencia = await this.agenciaService.updateAgencia(agenciaId, updateData);
            if (!updatedAgencia) return res.status(404).json({ status: 'error', message: 'Agencia no encontrada' });

            res.status(200).json({
                status: 'success',
                payload: {
                    agencia: {
                        _id: updatedAgencia._id,
                        nombre: updatedAgencia.nombre,
                        email: updatedAgencia.email,
                        nivel: updatedAgencia.nivel
                    }
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Eliminar cuenta de agencia
    deleteAccount = async (req, res) => {
        try {
            const agenciaId = req.user._id;
            const result = await this.agenciaService.deleteAgencia(agenciaId);
            
            if (!result) return res.status(404).json({ status: 'error', message: 'Agencia no encontrada' });

            res.clearCookie(configObject.cookie_name);
            res.status(200).json({ status: 'success', message: 'Cuenta eliminada correctamente' });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Obtener todos los empleados de la agencia
    getEmployees = async (req, res) => {
        try {
            const agenciaId = req.user._id;
            const agencia = await this.agenciaService.getAgenciaById(agenciaId).populate('usuarios');
            
            if (!agencia) return res.status(404).json({ status: 'error', message: 'Agencia no encontrada' });

            res.status(200).json({
                status: 'success',
                payload: {
                    empleados: agencia.usuarios
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Método para administradores (opcional)
    getAllAgencies = async (req, res) => {
        try {
            if (req.user.tipo !== 'admin') {
                return res.status(403).json({ status: 'error', message: 'No autorizado' });
            }

            const agencias = await this.agenciaService.getAgencias();
            res.status(200).json({
                status: 'success',
                payload: {
                    agencias
                }
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = AgenciaController;