/**
 * Controlador de insumos
 * @author Fausto Jarquin
 * @date 5/02/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Insumo = require('../../models/insumos/insumos');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/**
 * @function listarinsumos
 * @description Obtener todos los insumos.
 */
exports.listarinsumos = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    Insumo.findAll()
        .then(insumos => {
            contenido.tipo = 1;
            contenido.datos = insumos;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = 'Error al obtener los Insumos: ${err.message}';
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function buscarIdinsumo
 * @description Busca los datos de un insumo por su id
 */
exports.buscarIdinsumo = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            await Insumo.findOne({
                where: { id: id }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del cargo";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}


/**
 * @function buscarNombreinsumo
 * @description Busca el el insumo por su nombre.
 */
exports.buscarNombre = async (req, res) => {
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
            const { nombre } = req.query;
            
            await Insumo.findAll({
                where: {
                    [Op.or]: {
                        nombre: {
                            [Op.like]: nombre
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
                contenido.msj = "Error al cargar los datos del insumo";
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
 * @function guardarInsumo
 * @description Guarada los datos de un Insumo
 */
exports.guardarInsumo = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            await Insumo.create({ ...req.body }).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = data;
                contenido.msj = "Error al guaradar el registro";
                Respuesta.enviar(200, contenido, res);
            });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarInsumos
 * @description Actualiza los datos de un Insumo
 */
exports.editarInsumo = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            await Insumo.update(
                { ...req.body },
                { where: { id: id } }
            ).then(async (data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
                Respuesta.enviar(500, contenido, res);
            });

        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}


