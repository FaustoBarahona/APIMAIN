const { body, query } = require('express-validator');
const inventarioController = require('../../controller/inventario/inventarioController');
const router = require("express").Router();
const { Op } = require('sequelize');
const Inventario = require('../../models/inventario/inventario'); // Importa el modelo de inventario

// Ruta principal con la información básica de la API
router.get('/', (req, res) => {
    const data = {
        apiName: 'API - SIGBIR',
        propietario: 'DESOFIW',
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
});

/**
 * @memberof routes/api/cliente
 * @method listar
 * @description Lista todos el inventario guardado en la base de datos
 * {@link server/api/inventario/listar} 
 */
router.get("/listar", inventarioController.listarinventario);

module.exports = router;