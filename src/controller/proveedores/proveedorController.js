/**
 * Controlador de proveedores
 * @author Fausto Jarquin
 * @date 20/06/2023
 * 
 */
const fs = require("fs");
const path = require("path");
//Importar los modelos necesarios
const ModeloProveedor = require("../../models/proveedores/proveedores");
const ModeloProveedorTelefono = require("../../models/proveedores/proveedortelefono");
const ModeloLugar = require('../../models/lugares/lugar');
const ModeloMunicipio = require('../../models/lugares/municipios');
const ModeloDepartamento = require('../../models/lugares/departamento');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarProveedores
 * @description Lista los proveedores
 */
exports.listarProveedores = async (req, res) => {
    // Inicializar objeto de respuesta
    let contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    try {
        console.log(req.ip);
        console.log(req.headers['user-agent']);
        await ModeloProveedor.findAll(
            {
            include: [
                {
                    model: ModeloProveedorTelefono,
                    attributes: ['numero']
                },
                {
                    model: ModeloLugar,
                    attributes: ['nombre'],
                    include: {
                        model: ModeloMunicipio,
                        attributes: ['nombre'],
                        include: {
                            model: ModeloDepartamento,
                            attributes: ['nombre'],
                        }
                    }
                }
            ],
            order: [
                ['nombre', 'DESC']
            ], 
        }
    ).
        then((data) => {
            contenido.tipo = 1;
            contenido.datos = data;
            Respuesta.enviar(200, contenido, res);
        }).
        catch((er) => {
            contenido.tipo = 0;
            contenido.msj = "Error al cargar los datos de Proveedores";
            Respuesta.enviar(500, contenido, res);
        });
} catch (error) {
    contenido.tipo = 0;
    contenido.msj = "Error en el servidor";
    Respuesta.enviar(500, contenido, res);
}
}

/**
 * @function guardarProveedor
 * @description Guarda los datos de un proveedor
 */
exports.guardarProveedor = async (req, res) => {
    // Inicializar objeto de respuesta
    let contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    try {
        const { numeros } = req.body;
        console.log(numeros);

        // Validar los datos del proveedor
        contenido.msj = msjErrores.lista(validationResult(req));
        if (contenido.msj.length > 0) {
            Respuesta.enviar(400, contenido, res);
        } else {
            // Crear el proveedor en la base de datos
            const proveedor = await ModeloProveedor.create({ ...req.body });

            // Guardar los números de teléfono asociados al proveedor
            for (const numero of numeros) {
                await ModeloProveedorTelefono.create({
                    proveedorId: proveedor.id,
                    numero: numero.numero
                }).catch((error) => {
                    contenido.tipo = 0;
                    contenido.msj = "Error al guardar el registro";
                    Respuesta.enviar(500, contenido, res);
                });
            }

            contenido.tipo = 1;
            contenido.datos = proveedor;
            contenido.msj = "Registro guardado correctamente";
            Respuesta.enviar(200, contenido, res);
        }
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
};

/**
 * @function editarProveedor
 * @description Actualiza los datos de un proveedor
 */
exports.editarProveedor = async (req, res) => {
    // Inicializar objeto de respuesta
    let contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    try {
        // Validar los datos del proveedor
        contenido.msj = msjErrores.lista(validationResult(req));
        if (contenido.msj.length > 0) {
            Respuesta.enviar(400, contenido, res);
        } else {
            const { id } = req.query;
            const { numeros } = req.body;

            await ModeloProveedor.update(
                { ...req.body },
                { where: { id: id } }
            ).then(async (data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro actualizado correctamente";

                // Eliminar los números de teléfono asociados al proveedor
                await ModeloProveedorTelefono.destroy({
                    where: { proveedorId: id }
                });

                // Guardar los nuevos números de teléfono asociados al proveedor
                for (const numero of numeros) {
                    await ModeloProveedorTelefono.create({
                        proveedorId: id,
                        numero: numero.numero
                    }).catch((error) => {
                        contenido.tipo = 0;
                        contenido.msj = "Error al guardar el registro";
                        Respuesta.enviar(500, contenido, res);
                    });
                }

                Respuesta.enviar(200, contenido, res);
            }).catch((error) => {
                contenido.tipo = 0;
                contenido.datos = error;
                contenido.msj = "Error al actualizar el registro";
                Respuesta.enviar(500, contenido, res);
            });
        }
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
};

/**
 * @function activarProveedor
 * @description Actualiza el estado de un proveedor
 */
exports.activarProveedor = async (req, res) => {
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
            await ModeloProveedor.update(
                { ...req.body },
                { where: { id: id } }
            ).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro actualizado correctamente";
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
            });
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

