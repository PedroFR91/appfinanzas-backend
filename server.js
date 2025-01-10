const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

// IMPORTAR DEPENDENCIAS PARA SESIÓN Y PASSPORT
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

// Cargar variables de entorno
dotenv.config();

// Cargar configuración de Passport (GoogleStrategy, etc.)
require('./config/passport');

const app = express();
app.use(express.json());

// CONFIGURACIÓN CORS (ajusta origin según tu dominio/frontend)
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.set("trust proxy", 1);
// CONFIGURAR LA SESIÓN
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore, // Usar SequelizeStore o similar
        cookie: {
            httpOnly: true,
            secure: true, // Solo con HTTPS
            sameSite: "none", // Requerido para CORS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        },
    })
);

// INICIALIZAR PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// IMPORTAR RUTAS
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');

// USAR RUTAS
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// RUTA DE PRUEBA
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Backend funcionando correctamente!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa con la base de datos');
    } catch (error) {
        console.error('No se pudo conectar con la base de datos:', error);
    }
});
