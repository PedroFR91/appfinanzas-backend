const { Data } = require('../models');

exports.createEntries = async (req, res) => {
    const { entries } = req.body;
    const userId = req.user.id; // Asegúrate de que el usuario esté autenticado

    if (!entries || !Array.isArray(entries)) {
        return res.status(400).json({ error: 'Datos no válidos' });
    }

    try {
        const createdEntries = await Data.bulkCreate(
            entries.map((entry) => ({ ...entry, userId }))
        );
        res.status(201).json(createdEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos', details: error.message });
    }
};
