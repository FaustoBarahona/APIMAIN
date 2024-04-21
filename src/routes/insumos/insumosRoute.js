//const express = require('express');
const { body, query } = require('express-validator');
const insumoController = require('../../controller/insumos/insumosController');
var router = require("express").Router();
const { Op } = require('sequelize');
const Modeloinsumo = require('../../models/insumos/insumos');


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
// Ruta principal con la información básica de la API

/**
 * @memberof routes/api/cliente
 * @method listar
 * @description Lista todos los insumos guardados en la base de datos
 * {@link server/api/insumos/listar} 
 */
router.get("/listar", insumoController.listarinsumos);


/**
 * @memberof routes/api/insumo
 * @method guardar
 * @description POST. Guardar los datos de un insumo
 * 
 * {@link server/api/insumos/guardar}
 * @param {string} nombre.required Nombre del insumo
 * @param {string} descripcion. descripcion de insumos
 */
router.post("/guardar",
  body("nombre").isLength({ min: 2, max: 50 }).withMessage("El limite de caracteres es de 2 - 50"),
  body("descripcion").isLength({ min: 10, max: 50 }).withMessage("El limite de caracteres es de 10 - 50"),
  insumoController.guardarInsumo);


/**
 * @memberof routes/api/insumos
 * @method editar
 * @description PUT. Editar los datos de un insumo
 * {@link server/api/insumos/editar}
 * @param {string} nombre.required Nombre del insumo
 * @param {string} descripcion descripcion de insumos
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un numero entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarId = await Modeloinsumo.findOne({where: {id: value}});
        if (!buscarId) {
          throw new Error('El id no existe');
        }
    }
  }),
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
body("descripcion").isLength({ min: 10, max: 50 }).withMessage("El limite de caracteres es de 10 - 50"),
insumoController.editarInsumo); 



module.exports = router;