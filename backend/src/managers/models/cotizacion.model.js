const { Schema, model, Types } = require('mongoose');

const CotizacionCollection = 'cotizacion';

const cotizacionSchema = new Schema({
  empleado: {
    type: Types.ObjectId,
    ref: 'empleado',
    required: true
  },
  agencia: {
    type: Types.ObjectId,
    ref: 'agencia',
    required: true
  },
  clienteNombre: {
    type: String,
    trim: true,
    required: true
  },
  clienteMail: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  clienteTelefono: {
    type: String,
    trim: true
  },
  fechaEnvio: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['espera', 'aceptada', 'rechazada'],
    default: 'espera'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Populate básico (solo para consultas)
cotizacionSchema.pre(/^find/, function() {
  this.populate({
    path: 'empleado',
    select: 'nombre mail telefono puesto'
  });
});

// Índices
cotizacionSchema.index({ agencia: 1 });
cotizacionSchema.index({ empleado: 1 });
cotizacionSchema.index({ estado: 1 });
cotizacionSchema.index({ fechaEnvio: -1 });

const cotizacionModel = model(CotizacionCollection, cotizacionSchema);

module.exports = { cotizacionModel };