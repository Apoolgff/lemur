const { AgenciaRepository } = require("./agencia.repository")
const { ClienteRepository } = require('./cliente.repository')
const { CotizacionRepository } = require("./cotizacion.repository")
const { EmpleadoRepository } = require('./empleado.repository')

//repositorios
const agenciaService = new AgenciaRepository()
const clienteService = new ClienteRepository()
const cotizacionService = new CotizacionRepository()
const empleadoService = new EmpleadoRepository()

module.exports = {
    agenciaService,
    clienteService,
    cotizacionService,
    empleadoService
};
