const jwt = require('jsonwebtoken');
const { configObject } = require('../../config/index');

const JWT_SECRET = configObject.jwt_secret_key;
const JWT_EXPIRATION = configObject.jwt_expiration_time || '1h';

// Generación de token (detecta automáticamente si es Agencia o Empleado)
const generateToken = (user) => {
  // Determina el tipo de usuario por las propiedades únicas del objeto
  const isAgencia = user.nivel !== undefined; // Ej: Agencias tienen 'nivel' (basic, premium)
  const isEmpleado = user.puesto !== undefined; // Ej: Empleados tienen 'puesto'

  const payload = {
    userId: user._id,
    email: user.email,
    // Campos condicionales:
    ...(isAgencia && { userType: 'agencia' }),
    ...(isEmpleado && { 
      userType: 'empleado',
      agenciaId: user.agencia, // Asume que el modelo Empleado ya tiene 'agencia'
      puesto: user.puesto
    })
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Verificación del token
const verifyToken = (req, res, next) => {
  const token = req.cookies[configObject.cookie_name] || 
               (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie(configObject.cookie_name);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Estructura limpia para el contexto
    req.user = {
      _id: decoded.userId,
      tipo: decoded.userType, // 'agencia' o 'empleado'
      email: decoded.email,
      ...(decoded.userType === 'empleado' && {
        agenciaId: decoded.agenciaId,
        puesto: decoded.puesto
      })
    };

    next();
  });
};

module.exports = { generateToken, verifyToken };


/*const jwt = require('jsonwebtoken');
const { configObject } = require('../config/index');

const JWT_SECRET = configObject.jwt_secret_key || 'your_secret_key'; 
const JWT_EXPIRATION = configObject.jwt_expiration_time || '1h'; 

const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        nombre: user.nombre,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    return token;
};

//verificael JWT en cada solicitud (verificacion en cookies y encabezado)
const verifyToken = (req, res, next) => {
    const tokenFromCookies = req.cookies[configObject.cookie_name];
    
    const tokenFromHeader = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    const token = tokenFromCookies || tokenFromHeader;
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    //Verifica el token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.clearCookie(configObject.cookie_name); 
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        req.user = decoded;


        next();
    });
};

module.exports = {
    generateToken,
    verifyToken
};*/
