const express = require('express');
//const axios = require('axios');
//const appRouter = require('./routes/index')
const path = require('path');
const { connectDB, configObject } = require('./config/index')
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

const PORT = configObject.PORT;
connectDB()

/*app.use(cors({ origin: 'http://localhost:5173', 
    credentials: true
}));*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(configObject.cookie_secret_key));
//app.use(appRouter)


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
