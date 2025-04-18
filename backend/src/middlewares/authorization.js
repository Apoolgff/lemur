exports.isAgencia = (req, res, next) => {
    if (req.user.tipo !== 'agencia') {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Acceso solo para agencias' 
        });
    }
    next();
};