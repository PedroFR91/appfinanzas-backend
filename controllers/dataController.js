const { Data } = require("../models");

// Crear múltiples entradas
exports.createEntries = async (req, res) => {
    console.log("Datos recibidos en /data:", req.body);

    const { entries, userId } = req.body; // Asegurarnos de recibir userId
    if (!entries || !Array.isArray(entries) || !userId) {
        console.error("Error: formato de datos no válido o falta userId");
        return res.status(400).json({ error: "Datos no válidos o falta userId" });
    }

    try {
        const entriesWithUserId = entries.map((entry) => ({
            ...entry,
            userId, // Asociar cada entrada al usuario
        }));

        console.log("Preparando para guardar en la base de datos:", entriesWithUserId);
        const createdEntries = await Data.bulkCreate(entriesWithUserId);
        console.log("Entradas creadas con éxito:", createdEntries);
        res.status(201).json(createdEntries);
    } catch (error) {
        console.error("Error al guardar en la base de datos:", error.message);
        res.status(500).json({ error: "Error al guardar los datos", details: error.message });
    }
};

// Obtener todos los datos para un usuario
exports.getAllData = async (req, res) => {
    try {
        const { userId } = req.query; // Filtrar por userId pasado como query param
        if (!userId) {
            return res.status(400).json({ error: "userId es obligatorio" });
        }

        const entries = await Data.findAll({
            where: { userId },
        });

        console.log("Datos obtenidos de la base de datos:", entries);
        res.status(200).json({ entries });
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
