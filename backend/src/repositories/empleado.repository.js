const EmpleadoDaoMongo = require('../managers/empleadoManagerMongo');

class EmpleadoRepository {
    constructor() {
        this.dao = new EmpleadoDaoMongo();
    }

    //Obtener todos los empleados
    getEmpleados = async () => await this.dao.get();

    //Obtener empleados con filtros y opciones 
    getEmpleadosLimited = async ({ filter, options }) => await this.dao.getLimited({ filter, options });

    //Obtener un empleado por un filtro
    getEmpleadoBy = async (filter) => await this.dao.getBy(filter);

    //Obtener un empleado por ID
    getEmpleadoById = async (eid) => await this.dao.getById(eid);

    //Crear un nuevo empleado
    createEmpleado = async (empleado) => await this.dao.create(empleado);

    //Actualizar un empleado por ID
    updateEmpleado = async (eid, updatedFields) => await this.dao.update(eid, updatedFields);

    //Eliminar un empleado por ID
    deleteEmpleado = async (eid) => await this.dao.delete(eid);
}

module.exports = { EmpleadoRepository }; 