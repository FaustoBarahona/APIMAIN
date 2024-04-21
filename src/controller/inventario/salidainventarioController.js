const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Inventario = require('../../models/inventario/inventario');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');
const SalidaInventario = require('../../models/inventario/salidainventario');
const ModeloUsuario = require("../../models/empleados/usuario");
const ModeloInsumos = require("../../models/insumos/insumos");



/**
 * @function listarSalidaInventario
 * @description Obtener todas las compras de insumos.
 */
exports.listarsalidainventario = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    SalidaInventario.findAll({
        include: [
            { model: Inventario, include: [ModeloInsumos] }, // Incluye Inventario y su relación con Insumos
            { model: ModeloUsuario } // Incluye el modelo de Usuario asociado a cada salida de inventario
        ]
    })
        .then(salida => {
            contenido.tipo = 1;
            contenido.datos = salida;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener Salida de Inventario: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function guardarSalidaInventario
 * @description Guarda una salida de inventario y actualiza el inventario
 */
exports.guardarSalidaInventario = async (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    } else {
        try {
            // Verificar la existencia del inventario
            const { InventarioId, cantidadsalida } = req.body;
            const inventario = await Inventario.findByPk(InventarioId);

            if (!inventario) {
                contenido.tipo = 0;
                contenido.msj = "El inventario no existe";
                Respuesta.enviar(404, contenido, res);
                return;
            }

            // Actualizar el inventario
            const nuevaCantidad = inventario.cantidad - cantidadsalida;
            await inventario.update({ cantidad: nuevaCantidad });

            // Guardar la salida de inventario
            const nuevaSalida = await SalidaInventario.create({ ...req.body });

            contenido.tipo = 1;
            contenido.datos = nuevaSalida;
            contenido.msj = "Salida de inventario registrada correctamente";
            Respuesta.enviar(201, contenido, res);
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};