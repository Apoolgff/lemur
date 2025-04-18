const { Schema, model, Types } = require('mongoose');

const AgenciaCollection = 'agencia'; // Mejor en minúsculas y plural (convención MongoDB)

const agenciaSchema = new Schema({
  nombre: { 
    type: String,
    trim: true // Limpia espacios en blanco al inicio/final
  },
  email: { 
    type: String,
    lowercase: true // Normaliza a minúsculas
  },
  web: { 
    type: String,
    trim: true
  },
  redes: [{
    red: { 
      type: String,
      enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'otro'] // Opciones controladas
    },
    url: { type: String } // Separado para mejor estructura
  }],
  telefonos: [{
    numero: { 
      type: String,
      trim: true
    },
    tipo: {
      type: String,
      enum: ['movil', 'fijo', 'whatsapp']
    }
  }],
  direccion: {
    type: String,
    trim: true
  },
  logo: { 
    type: String,
    default: '' // Valor por defecto
  },
  password: { 
    type: String,
    select: false // Nunca se devuelve en consultas
  },
  nivel: { 
    type: String,
    enum: ['basic', 'standard', 'premium'], // Valores fijos
    default: 'basic'
  },
  usuarios: [{ 
    type: Types.ObjectId, // Usar Types.ObjectId directamente
    ref: 'empleado' // Nombre del modelo referenciado (en minúscula)
  }]
}, { 
  timestamps: true,
  versionKey: false // Elimina __v (útil si no necesitas control de versiones)
});

// Populate optimizado para todas las consultas
agenciaSchema.pre(/^find/, function() {
  this.populate({
    path: 'usuarios',
    select: '-password -__v' // Excluye el password al popular
  });
});

agenciaSchema.index({ email: 1 }, { unique: true });
agenciaSchema.index({ nombre: 1 });
agenciaSchema.index({ usuarios: 1 });


const agenciaModel = model(AgenciaCollection, agenciaSchema);

module.exports = { agenciaModel }; // Exporta directamente el modelo