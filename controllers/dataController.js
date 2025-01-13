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
        console.log("Datos obtenidos de la base de datos:", entries);

        const dashboardData = transformData(entries); // Transforma los datos
        console.log("Datos transformados para el dashboard:", dashboardData);

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

// Transforma los datos para adaptarse al formato del dashboard
const transformData = (entries) => {
    const metrics = {
        winrate: 0,
        profit_factor: 0,
        total_tps: 0,
        total_sls: 0,
        total_bes: 0,
    };

    const charts_data = {
        cumulative_pnl: {
            dates: [],
            values: [],
        },
        trade_distribution: {
            tp: 0,
            sl: 0,
            be: 0,
        },
    };

    const session_performance = [];
    const day_performance = [];
    const hour_performance = [];
    const streaks = {
        tp: { streak: 0, start_date: "", end_date: "", pnl: 0 },
        sl: { streak: 0, start_date: "", end_date: "", pnl: 0 },
        be: { streak: 0, start_date: "", end_date: "", pnl: 0 },
    };
    const asset_ranking = [];

    // Procesar cada entrada
    entries.forEach((entry) => {
        // Lógica para calcular métricas
        metrics.total_tps += entry.tp || 0;
        metrics.total_sls += entry.sl || 0;
        metrics.total_bes += entry.be || 0;

        // Actualizar distribución de trades
        charts_data.trade_distribution.tp += entry.tp || 0;
        charts_data.trade_distribution.sl += entry.sl || 0;
        charts_data.trade_distribution.be += entry.be || 0;

        // Actualizar P&L acumulado
        charts_data.cumulative_pnl.dates.push(entry.date || "N/A");
        const lastValue =
            charts_data.cumulative_pnl.values[
            charts_data.cumulative_pnl.values.length - 1
            ] || 0;
        charts_data.cumulative_pnl.values.push(lastValue + (entry.pnl || 0));

        // Agregar datos a session_performance, day_performance, hour_performance
        session_performance.push({
            SESSION: entry.session,
            total_operations: entry.total_operations || 0,
            winrate: entry.winrate || 0,
            total_pnl: entry.pnl || 0,
        });

        // Similar lógica para otros
    });

    // Calcular winrate y profit factor
    const totalTrades = metrics.total_tps + metrics.total_sls + metrics.total_bes;
    metrics.winrate = totalTrades ? (metrics.total_tps / totalTrades) * 100 : 0;
    metrics.profit_factor =
        metrics.total_sls > 0 ? metrics.total_tps / metrics.total_sls : 0;

    return {
        metrics,
        charts_data,
        session_performance,
        day_performance,
        hour_performance,
        streaks,
        asset_ranking,
    };
};
