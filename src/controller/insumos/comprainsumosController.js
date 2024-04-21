const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const CompraInsumos = require('../../models/insumos/comprainsumos'); // Importa el modelo de comprainsumos
const ModeloInsumos = require("../../models/insumos/insumos");
const ModeloProveedor = require("../../models/proveedores/proveedores");
const ModeloCaja = require("../../models/cajas/caja");
const ModeloUsuario = require("../../models/empleados/usuario");
const Inventario = require("../../models/inventario/inventario");
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');
const myFiles = require("../../Config/files");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * @function listarCompraInsumos
 * @description Obtener todas las compras de insumos.
 */
exports.listarinsumos = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    CompraInsumos.findAll({
        include: [ModeloInsumos, ModeloProveedor, ModeloCaja, ModeloUsuario] // Incluye los insumos, proveedores, caja y usuario asociados a cada compra
    })
        .then(compras => {
            contenido.tipo = 1;
            contenido.datos = compras;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener las compras de insumos: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function buscarCompraInsumoPorId
 * @description Busca los datos de una compra de insumo por su id
 */
exports.buscarCompraInsumoPorId = async (req, res) => {
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
            const { id } = req.query;
            const compraInsumo = await CompraInsumos.findOne({
                where: { id: id }
            });
            if (compraInsumo) {
                contenido.tipo = 1;
                contenido.datos = compraInsumo;
                Respuesta.enviar(200, contenido, res);
            } else {
                contenido.tipo = 0;
                contenido.msj = "No se encontró la compra de insumo con el ID proporcionado";
                Respuesta.enviar(404, contenido, res);
            }
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/**
 * @function guardarCompraInsumo
 * @description Guarda los datos de una compra de insumo y actualiza el inventario
 */
exports.guardarCompraInsumos = async (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    console.log(req.body);

    // Verificar la presencia del campo 'InsumoId' en el cuerpo de la solicitud
    if (!req.body.InsumoId) {
        contenido.tipo = 0;
        contenido.msj = "El campo 'InsumoId' es requerido en el cuerpo de la solicitud";
        Respuesta.enviar(400, contenido, res);

        return;
    }

    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    } else {
        try {
            // Calcular subtotal
            const cantidad = req.body.cantidad;
            const preciounitario = req.body.preciounitario;
            const subtotal = cantidad * preciounitario;

            // Calcular totalcompra
            let totalcompra = subtotal;

            // Crear la nueva compra de Insumo con los datos actualizados
            const nuevaCompraInsumo = await CompraInsumos.create({
                ...req.body,
                subtotal: subtotal,
                totalcompra: totalcompra
            });

            // Actualizar el inventario
            const InsumoId = req.body.InsumoId;
            const cantidadComprada = req.body.cantidad;
            const compraInsumoId = nuevaCompraInsumo.id;
            // Asegúrate de tener la función actualizarInventario implementada correctamente
            await actualizarInventario(InsumoId, cantidadComprada, compraInsumoId);

            contenido.tipo = 1;
            contenido.datos = nuevaCompraInsumo;
            contenido.msj = "Compra de insumo guardada correctamente";
            Respuesta.enviar(201, contenido, res);
        } catch (error) {
            console.log(req)
            console.log(error)
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};
// Función auxiliar para actualizar el inventario
async function actualizarInventario(InsumoId, cantidadComprada, compraInsumoId) {
    try {
        let inventario = await Inventario.findOne({ where: { InsumoId: InsumoId } });
        if (!inventario) {
            // Si no existe un registro de inventario para este insumo, creamos uno nuevo
            inventario = await Inventario.create({ InsumoId: InsumoId, cantidad: cantidadComprada, compraInsumoId: compraInsumoId });
        } else {
            // Si ya existe un registro de inventario, actualizamos la cantidad sumando la cantidad comprada
            const nuevaCantidad = inventario.cantidad + cantidadComprada;
            await inventario.update({ cantidad: nuevaCantidad, compraInsumoId: compraInsumoId });
        }
    } catch (error) {
        console.error("Error al actualizar el inventario:", error);
        throw error;
    }
}

exports.editarCompraInsumos = async (req, res) => {
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
            const { id } = req.query;
            const compraInsumo = await CompraInsumos.findByPk(id);
            if (!compraInsumo) {
                contenido.tipo = 0;
                contenido.msj = "No se encontró la compra de insumo con el ID proporcionado";
                Respuesta.enviar(404, contenido, res);
                return;
            }

            // Guarda la cantidad original y el precio unitario original de la compra de insumos
            const cantidadOriginal = compraInsumo.cantidad;
            const precioUnitarioOriginal = compraInsumo.preciounitario;

            // Actualiza la compra de insumos con los datos enviados en la solicitud
            await compraInsumo.update({ ...req.body });

            // Calcula el nuevo subtotal y el nuevo total
            const cantidadNueva = compraInsumo.cantidad;
            const precioUnitarioNuevo = compraInsumo.preciounitario;
            const subtotalNuevo = cantidadNueva * precioUnitarioNuevo;
            const diferenciaCantidad = cantidadNueva - cantidadOriginal;
            const diferenciaPrecio = precioUnitarioNuevo - precioUnitarioOriginal;
            const totalNuevo = compraInsumo.totalcompra + (diferenciaCantidad * precioUnitarioOriginal) + (cantidadOriginal * diferenciaPrecio);

            // Actualiza la compra de insumos con los nuevos valores de subtotal y total
            await compraInsumo.update({ subtotal: subtotalNuevo, totalcompra: totalNuevo });

            // Actualiza el inventario solo si cambió la cantidad
            if (diferenciaCantidad !== 0) {
                const InsumoId = compraInsumo.InsumoId;
                const compraInsumoId = compraInsumo.id;
                await actualizarInventario(InsumoId, diferenciaCantidad, compraInsumoId);
            }

            contenido.tipo = 1;
            contenido.datos = compraInsumo;
            contenido.msj = "Compra de insumo actualizada correctamente";
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};



/**
 * @function ValidarImagenFactura
 * @description Valida la imagen de la factura enviada
 */
exports.validarImagenFactura = (req, res, next) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    } else {
        myFiles.uploadImagenFactura(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "documentofactura", msj: "El tamaño máximo de la imagen es de 1MB" }];
                Respuesta.enviar(400, contenido, res);
            } else if (err) {
                console.log(err);
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "documentofactura", msj: "Tipos de imagen inválida" }];
                Respuesta.enviar(400, contenido, res);
            } else {
                next();
            }
        });
    }
}

/**
 * @function actualizarImagenCliente
 * @description Actualiza la imagen del cliente
 */
exports.actualizarImagenFactura = async (req, res) => {
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
            const imagen = req.file.filename;
            var buscarCompraInsumo = await CompraInsumos.findOne(
                { where: { id: id } }
            );
            if (!buscarCompraInsumo) {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "id", msj: "El id de la compra no existe" }];
                Respuesta.enviar(400, contenido, res);
            }
            else {
                const imagenAnterior = fs.existsSync(path.join(__dirname, '../../../public/uploads/images/comprainsumos/' + buscarCompraInsumo.documentofactura));
                if (imagenAnterior) {
                    fs.unlinkSync(path.join(__dirname, '../../../public/uploads/images/comprainsumos/' + buscarCompraInsumo.documentofactura)
                    );
                }
                const imagenNueva = fs.existsSync(path.join(__dirname, '../../../public/uploads/images/comprainsumos/' + req.file.filename));
                if (!imagenNueva) {
                    contenido.tipo = 2;
                    contenido.datos = [];
                    contenido.msj = [{ campo: "imagen", msj: "La imagen no existe o no se guardo correctamente" }];
                    Respuesta.enviar(400, contenido, res);
                }
                else {
                    buscarCompraInsumo.set({
                        documentofactura: imagen,
                    });
                    await buscarCompraInsumo.save();
                    contenido.tipo = 1;
                    contenido.datos = buscarCompraInsumo;
                    contenido.msj = "Registro actualizado correctamente";
                    Respuesta.enviar(200, contenido, res);
                }
            }

        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.datos = error;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }

    }
}