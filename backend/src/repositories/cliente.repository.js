const ClienteDaoMongo = require('../managers/clienteManagerMongo');

class ClienteRepository {
    constructor() {
        this.dao = new ClienteDaoMongo();
    }

    //Obtener todos los clientes
    getClientes = async () => await this.dao.get();

    //Obtener clientes con filtros y opciones 
    getClientesLimited = async ({ filter, options }) => await this.dao.getLimited({ filter, options });

    //Obtener un cliente por un filtro
    getClienteBy = async (filter) => await this.dao.getBy(filter);

    //Obtener un cliente por ID
    getClienteById = async (cid) => await this.dao.getById(cid);

    //Crear un nuevo cliente
    createCliente = async (cliente) => await this.dao.create(cliente);

    //Actualizar un cliente por ID
    updateCliente = async (cid, updatedFields) => await this.dao.update(cid, updatedFields);

    //Eliminar un cliente por ID
    deleteCliente = async (cid) => await this.dao.delete(cid);
}

module.exports = { ClienteRepository };