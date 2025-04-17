const { clienteModel } = require('./models/cliente.model');

class ClienteDaoMongo {
    constructor() {
        this.model = clienteModel;
    }

    //muestra todos los clientes
    async get() {
        return await this.model.find();
    }

    // Muestra un cliente especifico segun un filtro
    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Obtiene cliente por Id
    async getById(cid){
        return await this.model.findById({ _id: cid })
    }

    // Crea un cliente
    async create(cliente) {
        return await this.model.create(cliente);
    }
    
    //modifica cliente
    async update(cid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: cid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar cliente segun ID
    async delete(cid) { 
        return await this.model.findByIdAndDelete(cid); 
    }
      
    //Elimina varios clientes por filtro
    async deleteBy(filter) {
        return await this.model.deleteMany(filter);
    }
      
      
}

module.exports = ClienteDaoMongo;