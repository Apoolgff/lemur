const AgenciaDaoMongo = require('../managers/agenciaManagerMongo');

class AgenciaRepository {
    constructor() {
        this.dao = new AgenciaDaoMongo();
    }

    //Obtener todas las agencias
    getAgencias = async () => await this.dao.get();

    //Obtener agencias con filtros y opciones 
    getAgenciasLimited = async ({ filter, options }) => await this.dao.getLimited({ filter, options });

    //Obtener una agencia por un filtro
    getAgenciaBy = async (filter) => await this.dao.getBy(filter);

    //Obtener una agencia por ID
    getAgenciaById = async (aid) => await this.dao.getById(aid);

    //Crear una nueva agencia
    createAgencia = async (agencia) => await this.dao.create(agencia);

    //Actualizar una agencia por ID
    updateAgencia = async (aid, updatedFields) => await this.dao.update(aid, updatedFields);

    //Eliminar una agencia por ID
    deleteAgencia = async (aid) => await this.dao.delete(aid);
}

module.exports = { AgenciaRepository };
