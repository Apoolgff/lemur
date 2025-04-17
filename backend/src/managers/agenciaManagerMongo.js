const { agenciaModel } = require('./models/agencia.model');

class AgenciaDaoMongo {
    constructor() {
        this.model = agenciaModel;
    }

    //muestra todos las agencias
    async get() {
        return await this.model.find();
    }

    // Muestra una agencia especifico segun un filtro
    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Obtiene agencia por Id
    async getById(aid){
        return await this.model.findById({ _id: aid })
    }

    // Crea una agencia
    async create(agencia) {
        return await this.model.create(agencia);
    }
    
    //modifica agencia
    async update(aid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: aid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar agencia segun ID
    async delete(aid) { 
        return await this.model.findByIdAndDelete(aid); 
    }
      
    //Elimina varias agencias por filtro
    async deleteBy(filter) {
        return await this.model.deleteMany(filter);
    }
      
      
}

module.exports = AgenciaDaoMongo;