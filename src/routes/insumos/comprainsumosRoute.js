const { body, query } = require('express-validator');
const comprainsumosController = require('../../controller/insumos/comprainsumosController');
const ModeloInsumos = require("../../models/insumos/insumos");
const ModeloProveedor = require("../../models/proveedores/proveedores");
const ModeloCaja = require("../../models/cajas/caja");
const ModeloUsuario = require("../../models/empleados/usuario");
const router = require("express").Router();
const { Op } = require('sequelize');
const CompraInsumos = require('../../models/insumos/comprainsumos'); // Importa el modelo de comprainsumos

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
 * @memberof routes/api/comprainsumos
 * @method listar
 * @description Lista todas las compras de insumos guardadas en la base de datos
 * {@link server/api/comprainsumos/listar} 
 */
router.get("/listar", comprainsumosController.listarinsumos);

/**
 * @memberof routes/api/comprainsumos
 * @method guardar
 * @description POST. Guardar los datos de una compra de insumos
 * 
 *  {@link server/api/comprainsumos/guardar}
 * @param {integer} cantidad.required cantidad del insumo
 * @param {float} preciounitario.required Unidad de medida del insumo
 * 
 */
router.post("/guardar",
    body("cantidad").isInt({ min: 1 }).withMessage("La cantidad debe ser un número entero mayor que 0"),
    body("preciounitario").isFloat({ min: 1 }).withMessage("El precio unitario debe ser un número positivo"),
    //body("fechacompra").isDate().withMessage("La fecha de compra debe tener un formato de fecha válido"),
    body("InsumoId").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El InsumoId no permite valores nulos');
            }
            else {
                const buscarInsumoId = await ModeloInsumos.findOne({ where: { id: value } });
                if (!buscarInsumoId) {
                    throw new Error('El InsumoId no existe');
                }
            }
        }),
    
    comprainsumosController.guardarCompraInsumos
);

/**
 * @memberof routes/api/comprainsumos
 * @method editar
 * @description PUT. Editar los datos de una compra de insumos
 * 
 * {@link server/api/comprainsumos/editar}
 * @param {integer} id.required ID de la compra de insumo a editar
 * @param {integer} cantidad.required cantidad del insumo
 * @param {float} preciounitario.required Unidad de medida del insumo
 *
 */
router.put("/editar",
query("id").isInt().withMessage("El id debe ser un número entero")
    .custom(async value => {
      if (!value) {
        throw new Error('El id no permite valores nulos');
      }
      else {
        const buscarCompraInsumo = await CompraInsumos.findOne({
          where: { id: value }
        });
        if (!buscarCompraInsumo) {
          throw new Error('El Id de la compra no exite');
        }
      }
    }),
    body("cantidad").isInt({ min: 1 }).withMessage("La cantidad debe ser un número entero mayor que 0"),
    body("preciounitario").isFloat({ min: 0 }).withMessage("El precio unitario debe ser un número positivo"),
    //body("subtotal").isFloat({ min: 0 }).withMessage("El subtotal debe ser un número positivo"),
    //body("fechacompra").isDate().withMessage("La fecha de compra debe tener un formato de fecha válido"),
    body("InsumoId").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El insumoId no permite valores nulos');
            }
            else {
                const buscarInsumoId = await ModeloInsumos.findOne({ where: { id: value } });
                if (!buscarInsumoId) {
                    throw new Error('El insumoId no existe');
                }
            }
        }),
    body("proveedorId").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El proveedorId no permite valores nulos');
            }
            else {
                const buscarProveedorId = await ModeloProveedor.findOne({ where: { id: value } });
                if (!buscarProveedorId) {
                    throw new Error('El proveedorId no existe');
                }
            }
        }),
    body("cajaId").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El cajaId no permite valores nulos');
            }
            else {
                const buscarCajaId = await ModeloCaja.findOne({ where: { id: value } });
                if (!buscarCajaId) {
                    throw new Error('El cajaId no existe');
                }
            }
        }),
   
        comprainsumosController.editarCompraInsumos
);

/**
 * @memberof routes/api/comprainsumos
 * @method editarimagen
 * @description PUT. Actualiza la imagen del empleado
 * {@link server/api/comprainsumos/editarimagen}
 * @param {integer} id.required Id del insumo a actualizar
 * @param {imagen} documentofactura.required Imagen de la factura a actualizar 
 */
router.put("/editarimagen",
  query("id").isInt().withMessage("El id debe ser un numero entero"),
  comprainsumosController.validarImagenFactura,
  comprainsumosController.actualizarImagenFactura);


module.exports = router;
