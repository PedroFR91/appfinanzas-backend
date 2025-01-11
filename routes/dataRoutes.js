const express = require('express');
const router = express.Router();
const { createEntries } = require('../controllers/dataController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Ruta para crear entradas
router.post('/', isAuthenticated, createEntries);

module.exports = router;
