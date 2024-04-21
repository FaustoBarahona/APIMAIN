const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Inventario = require('../../models/inventario/inventario');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');
const ModeloInsumos = require("../../models/insumos/insumos");

/**
 * @function listarinventario
 * @description Obtener todo el inventario
 */
exports.listarinventario = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    Inventario.findAll(
        {
            include: [ModeloInsumos] // Incluye el modelo insumos
        })
        .then(inventario => {
            contenido.tipo = 1;
            contenido.datos = inventario;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al obtener el Inventario: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};
