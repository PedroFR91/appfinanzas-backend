const express = require("express");
const multer = require("multer");
const {
    createEntries,
    getAllData,
    deleteEntryById,
    uploadExcel,
} = require("../controllers/dataController");

const router = express.Router();

// Configurar multer para manejar la subida en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Ruta para crear entradas
router.post("/", createEntries);

// Ruta para obtener todos los datos
router.get("/", getAllData);

// Ruta para eliminar una entrada por ID
router.delete("/:id", deleteEntryById);

// Ruta para procesar archivo Excel
router.post("/upload", upload.single("file"), uploadExcel);

module.exports = router;
