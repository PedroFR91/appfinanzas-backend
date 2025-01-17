const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
const SequelizeStore = require('connect-session-sequelize')(session.Store); // Almacén de sesiones Sequelize

dotenv.config();

require('./config/passport'); // Configuración de Passport

const app = express();
app.use(express.json());
app.use(cookieParser()); // Middleware para parsear cookies

// Configuración de CORS
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
        credentials: true,
    })
);

// Configuración de SequelizeStore para las sesiones
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions',
});

// Sincronizar el almacén de sesiones
sessionStore.sync().catch((error) => {
    console.error('Error al sincronizar el almacén de sesiones:', error);
});

app.set('trust proxy', 1); // Requerido para cookies seguras en HTTPS
console.log('NODE_ENV:', process.env.NODE_ENV);
// Configurar sesiones con SequelizeStore
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            // En DESARROLLO local (HTTP), secure debe ser false:
            secure: process.env.NODE_ENV === 'production',
            // Para cross-site:
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    })
);


// Inicializar Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/dataRoutes');
// Middleware de autenticación
const isAuthenticated = require('./middlewares/isAuthenticated');

// Rutas
app.use('/users', isAuthenticated, userRoutes); // Proteger las rutas con isAuthenticated
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

// Ruta de prueba para verificar que el backend responde
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
