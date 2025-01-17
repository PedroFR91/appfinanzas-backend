const { Data } = require("../models");
const XLSX = require("xlsx");

// Crear múltiples entradas
exports.createEntries = async (req, res) => {
    console.log("Datos recibidos en /data:", req.body);

    const { entries, userId } = req.body;
    if (!entries || !Array.isArray(entries) || !userId) {
        console.error("Error: formato de datos no válido o falta userId");
        return res.status(400).json({ error: "Datos no válidos o falta userId" });
    }

    try {
        const entriesWithUserId = entries.map((entry) => ({
            ...entry,
            userId,
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
        const { userId } = req.query;
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


// Procesar archivo Excel
exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file || !req.body.userId) {
            return res.status(400).json({ error: "Archivo o userId no proporcionado" });
        }

        const { buffer } = req.file; // Archivo cargado
        const userId = parseInt(req.body.userId, 10);

        // Leer archivo Excel
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            defval: null,
            cellDates: true,
            raw: false,
        });


        // Filtrar y transformar datos
        const validEntries = data
            .filter((row) => row.DATE && row.ASSET && row.SESSION) // Filtrar filas válidas
            .map((row) => ({
                userId,
                date: row.DATE ? new Date(row.DATE) : null, // Convertir fecha
                day: row.DAY || null,
                open: row.OPEN ? row.OPEN.toString() : "00:00:00", // Validar horas
                close: row.CLOSE ? row.CLOSE.toString() : "00:00:00",
                asset: row.ASSET,
                session: row.SESSION,
                buySell: row["BUY/SELL"]?.trim() || null, // Eliminar espacios
                lots: parseFloat(row.LOTES) || 0, // Valores numéricos por defecto
                tpSlBe: row["TP/SL"] || null,
                pnl: parseFloat(row["$P&L"]) || 0,
                pnlPercentage: parseFloat(row["%P&L"]) || 0,
                ratio: row.RATIO || null,
                risk: parseFloat(row.RISK) || 0,
                temporalidad: row.TEMP || null,
            }));

        // Validar que no hay campos esenciales faltantes
        const sanitizedEntries = validEntries.filter((entry) => entry.date && entry.asset && entry.session);

        // Guardar en la base de datos
        const createdEntries = await Data.bulkCreate(sanitizedEntries);
        res.status(201).json({ message: "Entradas creadas con éxito", data: createdEntries });
    } catch (error) {
        console.error("Error al procesar el archivo Excel:", error);
        res.status(500).json({ error: "Error al procesar el archivo Excel", details: error.message });
    }
};

