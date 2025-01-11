const { Data } = require('../models');

exports.createEntries = async (req, res) => {
    console.log('Datos recibidos en /data:', req.body);

    const { entries } = req.body;
    if (!entries || !Array.isArray(entries)) {
        console.error('Error: formato de datos no válido');
        return res.status(400).json({ error: 'Datos no válidos' });
    }

    try {
        console.log('Preparando para guardar en la base de datos:', entries);
        const createdEntries = await Data.bulkCreate(entries);
        console.log('Entradas creadas con éxito:', createdEntries);
        res.status(201).json(createdEntries);
    } catch (error) {
        console.error('Error al guardar en la base de datos:', error.message);
        res.status(500).json({ error: 'Error al guardar los datos', details: error.message });
    }
};

