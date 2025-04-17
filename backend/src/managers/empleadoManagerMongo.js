const { empleadoModel } = require('./models/empleado.model');

class EmpleadoDaoMongo {
    constructor() {
        this.model = empleadoModel;
    }

    //muestra todos los empleados
    async get() {
        return await this.model.find();
    }

    // Muestra un empleado especifico segun un filtro
    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Obtiene empleado por Id
    async getById(eid){
        return await this.model.findById({ _id: eid })
    }

    // Crea un empleado
    async create(empleado) {
        return await this.model.create(empleado);
    }
    
    //modifica empleado
    async update(eid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: eid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar empleado segun ID
    async delete(eid) { 
        return await this.model.findByIdAndDelete(eid); 
    }
      
    //Elimina varios empleados por filtro
    async deleteBy(filter) {
        return await this.model.deleteMany(filter);
    }
      
      
}

module.exports = EmpleadoDaoMongo;