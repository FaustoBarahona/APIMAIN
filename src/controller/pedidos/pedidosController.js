/**
 * Controlador de pedido
 * @author Fausto Jarquin
 * @date 20/01/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Pedido = require('../../models/pedidos/pedido');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/**
 * @function getAll
 * @description Obtener todos los pedidos.
 */
exports.getAll = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    Pedido.findAll()
        .then(pedidos => {
            contenido.tipo = 1;
            contenido.datos = pedidos;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al obtener los Pedidos: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function getById
 * @description Obtener pedidos por su Id.
 */
exports.getById = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const pedidoId = req.params.id;

    Pedido.findByPk(pedidoId)
        .then(pedido => {
            if (pedido) {
                contenido.tipo = 1;
                contenido.datos = pedido;
                Respuesta.enviar(200, contenido, res);
            } else {
                contenido.msj = 'pedido no encontrado';
                Respuesta.enviar(404, contenido, res);
            }
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al obtener el Pedido: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function buscarNombrepedido
 * @description Obtiene el nombre del pedido por la fecha.
 */
exports.buscarNombrepedido = async (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));

    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    } else {
        try { 
            const { nombrepedido } = req.query;
            
            await Pedido.findAll({
                where: {
                    [Op.or]: {
                        nombrepedido: {
                            [Op.like]: nombrepedido
                        },
                    }
                }
            }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                console.log(er);
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del pedido";
                Respuesta.enviar(500, contenido, res);
            });

        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};


/**
 * @function create
 * @description Crear un nuevo pedido.
 */
exports.create = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const nuevoPedido = req.body;

    Pedido.create(nuevoPedido)
        .then(result => {
            contenido.tipo = 1;
            contenido.datos = { id: result.id, message: 'Pedido creado correctamente' };
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al crear el pedido: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function update
 * @description Actualizar un pedido por su ID.
 */
exports.update = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const pedidoId = req.params.id;
    const datosActualizados = req.body;

    Pedido.update(datosActualizados, { where: { id: pedidoId } })
        .then(() => {
            contenido.tipo = 1;
            contenido.datos = { message: 'Pedido actualizado correctamente' };
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al actualizar el Pedido: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function deleteById
 * @description Eliminar un pedido por su ID.
 */
exports.deleteById = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const pedidoId = req.params.id;

    Pedido.destroy({ where: { id: pedidoId } })
        .then(() => {
            contenido.tipo = 1;
            contenido.datos = { message: 'Pedido eliminado correctamente' };
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al eliminar el Pedido: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};