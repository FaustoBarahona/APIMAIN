const proveedorController = require('../../controller/proveedores/proveedorController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloLugar = require('../../models/lugares/lugar');
const { Op } = require('sequelize');

/**
 * 
 */
router.get("/", (req, res) => {

    const data = {
      apiName: "API - SIGBIR",
      propietario: "DESOFIW",
    };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(data);
  });

  /**
 * @memberof routes/api/proveedor
 * @method listar
 * @description Lista todos los proveedores guardados en la base de datos
 * {@link server/api/proovedores/listar} 
 */
router.get("/listar", proveedorController.listarProveedores);

/**
 * @memberof routes/api/proveedor
 * @method guardar
 * @description POST. Guardar los datos de un proveedor
 * 
 * {@link server/api/proveedores/guardar}
 * @param {string} rtn.required - El RTN del proveedor
 * @param {string} nombre.required - El nombre del proveedor
 * @param {text} direccion - La dirección del proveedor
 * @param {string} correo.required - El correo electrónico del proveedor (opcional)
 * @param {boolean} activo - El estado del proveedor (opcional)
 */
router.post("/guardar",
  body("rtn")
    .notEmpty().withMessage("Debe proporcionar el RTN del proveedor")
    .isLength({ min: 13, max: 15 }).withMessage("El RTN debe tener entre 13 y 15 caracteres"),
  body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
  body("lugarId").isInt().withMessage("Debe selecionar un lugar valido")
    .custom(async value => {
      if (!value) {
        throw new Error('El lugar no permite valores nulos');
      }
      else {
        const buscarLugar = await ModeloLugar.findOne({
          where: { id: value }
        });
        if (!buscarLugar) {
          throw new Error('El lugar no exite');
        }
      }
    }),
  body('direccion').isLength({ min: 5 }).withMessage("Debe escribir el domicilio del cliente"),
  body("correo").isEmail().withMessage("Debe proporcionar un correo electrónico válido"),
  body("activo").optional().isBoolean().withMessage("El estado del proveedor debe ser un valor booleano"),
  proveedorController.guardarProveedor
);

/**
 * @memberof routes/api/proveedor
 * @method editar
 * @description PUT. Guardar los datos de un proveedor
 * {@link server/api/proveedores/editar} 
 * 
 * @param {string} rtn. - El RTN del proveedor (debe tener entre 13 y 15 caracteres)
 * @param {string} nombre.required - El nombre del proveedor (debe tener entre 3 y 50 caracteres)
 * @param {text} direccion - La dirección del proveedor (debe tener entre 3 y 80 caracteres)
 * @param {string} correo - El correo electrónico del proveedor (opcional)
 * @param {boolean} activo - El estado del proveedor (opcional)
 */
router.put("/editar",
  query("id").isInt().withMessage("El ID debe ser un número entero")
    .custom(async value => {
      if (!value) {
        throw new Error('El ID no permite valores nulos');
      }
    }),
body("rtn")
    .notEmpty().withMessage("Debe proporcionar el RTN del proveedor")
    .isLength({ min: 13, max: 15 }).withMessage("El RTN debe tener entre 13 y 15 caracteres"),
  body("nombre").isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  body("lugarId").isInt().withMessage("Debe selecionar un lugar valido")
  .custom(async value => {
      if (!value) {
          throw new Error('El lugar no permite valores nulos');
      }
      else {
          const buscarLugar = await ModeloLugar.findOne({
              where: { id: value }
          });
          if (!buscarLugar) {
              throw new Error('El lugar no exite');
          }
      }
  }),
body('direccion').isLength({ min: 5 }).withMessage("Debe escribir el domicilio del cliente"),
  body("correo").isEmail().withMessage("Debe proporcionar un correo electrónico válido"),
  body("activo").optional().isBoolean().withMessage("El estado del proveedor debe ser un valor booleano"),
  proveedorController.editarProveedor
);

/**
 * @memberof routes/api/proveedor
 * @method activar
 * @description PUT. Actualiza si un proveedor esta activo o inactivo
 * {@link server/api/proveedores/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar",
  query("id").isInt().withMessage("El id debe ser un numero entero"),
  body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
  proveedorController.activarProveedor);


module.exports = router;