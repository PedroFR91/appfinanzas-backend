const express = require('express');
const router = express.Router();
const { createEntries } = require('../controllers/dataController');


// Ruta para crear entradas
router.post('/', createEntries);

module.exports = router;
