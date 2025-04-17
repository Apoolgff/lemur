const { cotizacionModel } = require('./models/cotizacion.model');

class CotizacionDaoMongo {
    constructor() {
        this.model = cotizacionModel;
    }

    //muestra todas las cotizaciones
    async get() {
        return await this.model.find();
    }

    // Muestra un cotizacion especifica segun un filtro
    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Obtiene cotizacion por Id
    async getById(cid){
        return await this.model.findById({ _id: cid })
    }

    // Crea una cotizacion
    async create(cotizacion) {
        return await this.model.create(cotizacion);
    }
    
    //modifica cotizacion
    async update(cid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: cid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar cotizacion segun ID
    async delete(cid) { 
        return await this.model.findByIdAndDelete(cid); 
    }
      
    //Elimina varias cotizaciones por filtro
    async deleteBy(filter) {
        return await this.model.deleteMany(filter);
    }
      
      
}

module.exports = CotizacionDaoMongo;