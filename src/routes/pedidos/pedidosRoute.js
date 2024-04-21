//const express = require('express');
const { query } = require('express-validator');
const pedidoController = require('../../controller/Pedidos/pedidosController');
var router = require("express").Router();
const { Op } = require('sequelize');


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

// Rutas CRUD para Pedido
router.get('/listar', pedidoController.getAll);

/**
 * @memberof routes/api/pedido
 * @method buscarid
 * @description Lista todos los pedidos guardados en la base de datos
 * {@link server/api/pedido/buscarid}
 * @param {integer} id del pedido 
 */
router.get('/buscarid', 
    query('id').isInt().withMessage('El id debe ser un número entero'),
    pedidoController.getById
);

/**
 * @memberof routes/api/pedido
 * @method buscarNombrepedido
 * @description Lista todos los nombres de los pedidos con el nombrepedido
 * {@link server/api/alquiler/buscarNombrepedido}
 * @param {string} nombrepedido
 */
router.get('/buscarNombrepedido', 
    query('nombrepedido').isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50'),
    pedidoController.buscarNombrepedido
);


router.post('/crear', pedidoController.create);
router.put('/editar/:id', pedidoController.update);
router.delete('/eliminar/:id', pedidoController.deleteById);

module.exports = router;