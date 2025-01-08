const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa con la base de datos');
    } catch (error) {
        console.error('No se pudo conectar con la base de datos:', error);
    }
});


app.use('/users', userRoutes);