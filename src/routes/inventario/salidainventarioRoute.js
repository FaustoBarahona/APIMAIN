const { body, query } = require('express-validator');
const salidainventarioController = require('../../controller/inventario/salidainventarioController');
const router = require("express").Router();
const { Op } = require('sequelize');
const ModeloInventario = require('../../models/inventario/inventario'); // Importa el modelo de salidainventario

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
 * @description Listar la salida del inventario en la base de datos
 * {@link server/api/salidainventario/listar} 
 */
router.get("/listar", salidainventarioController.listarsalidainventario);

/**
 * @memberof routes/api/salidainventario
 * @method guardar
 * @description POST. Guardar las salidas de cantidad de inventario
 * 
 * @param {integer} cantidadsalida.required cantidad del insumo
 * @param {date} fechasalida.required fecha compra del insumo
 */
router.post("/guardar",
    body("cantidadsalida").isInt({ min: 1 }).withMessage("La cantidad debe ser un número entero mayor que 0"),
    //body("fechasalida").isDate().withMessage("La fecha de compra debe tener un formato de fecha válido"),
    body("InventarioId").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El InsumoId no permite valores nulos');
            }
            else {
                const buscarInventarioId = await ModeloInventario.findOne({ where: { id: value } });
                if (!buscarInventarioId) {
                    throw new Error('El InventarioId no existe');
                }
            }
        }),
    salidainventarioController.guardarSalidaInventario
);

module.exports = router;