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

// Obtener todos los datos
exports.getAllData = async (req, res) => {
    try {
        const entries = await Data.findAll();
        const dashboardData = transformData(entries); // Formato específico para el dashboard
        res.status(200).json({ entries, dashboardData });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener los datos." });
    }
};

// Eliminar una entrada por ID
exports.deleteEntryById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Data.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: "Entrada eliminada correctamente." });
        } else {
            res.status(404).json({ error: "Entrada no encontrada." });
        }
    } catch (error) {
        console.error("Error al eliminar la entrada:", error);
        res.status(500).json({ error: "Error al eliminar la entrada." });
    }
};