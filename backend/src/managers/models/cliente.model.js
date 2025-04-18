const { Schema, model, Types } = require('mongoose');

const ClienteCollection = 'cliente';

const clienteSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true
  },
  apellido: {
    type: String,
    trim: true,
    required: true
  },
  telefono: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true
  },
  cotizacionesRecibidas: [{
    type: Types.ObjectId,
    ref: 'cotizacion'
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Populate básico para cotizaciones
clienteSchema.pre(/^find/, function() {
  this.populate({
    path: 'cotizacionesRecibidas',
    select: '-_id -__v' // Excluimos campos internos
  });
});

// Índices
clienteSchema.index({ email: 1 });
clienteSchema.index({ nombre: 1 });
clienteSchema.index({ apellido: 1 });

const clienteModel = model(ClienteCollection, clienteSchema);

module.exports = { clienteModel };