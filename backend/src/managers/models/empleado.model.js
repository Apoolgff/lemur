const { Schema, model, Types } = require('mongoose');

const EmpleadoCollection = 'empleado';

const empleadoSchema = new Schema({
  agencia: { 
    type: Types.ObjectId, 
    ref: 'agencia', // Singular y minúscula (coincide con el nombre del modelo)
    required: true // Mejor práctica: siempre definir si es obligatorio
  },
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
  mail: { 
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true // Evita duplicados
  },
  password: { 
    type: String,
    select: false, // Nunca se retorna en consultas
    required: true
  },
  cotizacionesEnviadas: { 
    type: Number, 
    default: 0,
    min: 0 // No puede ser negativo
  },
  conversiones: { 
    type: Number, 
    default: 0,
    min: 0
  },
  telefono: { 
    type: String,
    trim: true
  },
  puesto: { 
    type: String,
    enum: ['asesor', 'gerente', 'administrador'], // Valores controlados
    default: 'asesor'
  },
  foto: { 
    type: String,
    default: '' // Valor por defecto
  },
  clientes: [{ 
    type: Types.ObjectId, 
    ref: 'cliente' // Singular
  }],
  cotizaciones: [{ 
    type: Types.ObjectId, 
    ref: 'cotizacion' // Singular
  }]
}, { 
  timestamps: true,
  versionKey: false // Elimina __v
});

// Populate optimizado (excluye datos sensibles)
empleadoSchema.pre(/^find/, function() {
  this.populate({
    path: 'agencia',
    select: '-password -usuarios' // Excluye datos innecesarios
  }).populate({
    path: 'clientes',
    select: '-cotizacionesRecibidas' // Opcional: excluye campos pesados
  }).populate({
    path: 'cotizaciones',
    select: '-detalles' // Si 'detalles' es muy grande
  });
});

// Índices para búsquedas rápidas
empleadoSchema.index({ mail: 1 }); // Único ya está definido en el campo
empleadoSchema.index({ agencia: 1 }); // Para consultas por agencia
empleadoSchema.index({ puesto: 1 }); // Si filtran por puesto frecuentemente

const empleadoModel = model(EmpleadoCollection, empleadoSchema);

module.exports = { empleadoModel } // Exportación directa (sin llaves)