const CotizacionDaoMongo = require('../managers/cotizacionManagerMongo');

class CotizacionRepository {
    constructor() {
        this.dao = new CotizacionDaoMongo();
    }

    //Obtener todas las cotizaciones
    getCotizaciones = async () => await this.dao.get();

    //Obtener cotizaciones con filtros y opciones 
    getCotizacionesLimited = async ({ filter, options }) => await this.dao.getLimited({ filter, options });

    //Obtener una cotizacion por un filtro
    getCotizacionBy = async (filter) => await this.dao.getBy(filter);

    //Obtener una cotizacion por ID
    getCotizacionById = async (cid) => await this.dao.getById(cid);

    //Crear una nueva cotizacion
    createCotizacion = async (cotizacion) => await this.dao.create(cotizacion);

    //Actualizar una cotizacion por ID
    updateCotizacion = async (cid, updatedFields) => await this.dao.update(cid, updatedFields);

    //Eliminar una cotizacion por ID
    deleteCotizacion = async (cid) => await this.dao.delete(cid);
}

module.exports = { CotizacionRepository };