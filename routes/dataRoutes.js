const express = require('express');
const router = express.Router();
const { createEntries, getAllData, deleteEntryById } = require('../controllers/dataController');


// Ruta para crear entradas
router.post('/', createEntries);

// Ruta para obtener todos los datos
router.get("/", getAllData);

// Ruta para eliminar una entrada por ID
router.delete("/:id", deleteEntryById);

module.exports = router;
