/**
 * Rutas de la api
 * @author Carlos Flores
 * @date 2021 - 02 - 20
 * @namespace routes/api
 */

const express = require("express");
const router = express.Router();

//Importar las rutas
const salidainventario = require("./inventario/salidainventarioRoute");
const inventario = require("./inventario/inventarioRoute");
const proveedores = require("./proveedores/proveedoresRoute");
const comprainsumos = require("./insumos/comprainsumosRoute");
const insumos = require("./insumos/insumosRoute");
const pedidos = require("./pedidos/pedidosRoute");
const cargos = require("./empleados/cargosRoute");
const empleados = require("./empleados/empleadosRoute");
const profesiones = require('./clientes/profesionesRoute');
const clientes = require('./clientes/clientesRoute');
const autenticacion = require('./autenticacion/autenticacionRoute');
const usuario = require('./empleados/usuariosRoute');
const bancos = require('./bancos/bancosRoute');
const cuentas = require('./bancos/cuentasRoute');
const pos = require('./bancos/posRoute');
const lugares = require('./lugares/lugaresRoute');
const municipios = require('./lugares/municipiosRoute');
const departamentos = require('./lugares/departamentosRoute');
const paises = require('./lugares/paisesRoute');
const cajas = require('./cajas/cajasRoute');
const aperturas = require('./cajas/aperturasRoute');
const estaciones = require('./configuraciones/estacionesRoute');
const cierres = require('./cajas/cierresRoute');
const pagos = require('./cajas/pagosRoute');

/**
 * @memberof routes/api
 * @name salidainventario
 * @description Contiene las rutas de salidainventario
 */
router.use("/salidainventario", salidainventario);


/**
 * @memberof routes/api
 * @name inventario
 * @description Contiene las rutas de inventario
 */
router.use("/inventario", inventario);


/**
 * @memberof routes/api
 * @name proveedores
 * @description Contiene las rutas de proveedores
 */
router.use("/proveedores", proveedores);


/**
 * @memberof routes/api
 * @name comprainsumos
 * @description Contiene las rutas de comprainsumos 
 */
router.use("/comprainsumos", comprainsumos);

/**
 * @memberof routes/api
 * @name insumos
 * @description Contiene las rutas de los insumos 
 */
router.use("/insumos", insumos);

/**
 * @memberof routes/api
 * @name pedidos
 * @description Contiene las rutas de los pedidos de los empleados
 */
router.use("/pedidos", pedidos);

/**
 * @memberof routes/api
 * @name cargos
 * @description Contiene las rutas de los cargos de los empleados
 */
router.use("/cargos", cargos);

/**
 * @memberof routes/api
 * @name empleados
 * @description Contiene las rutas de los empleados
 */
router.use("/empleados", empleados);

/**
 * @memberof routes/clientes
 * @name clientes
 * @description Contiene las rutas de los lotes
 */
router.use("/clientes", clientes);

/**
 * @memberof routes/usuarios
 * @name usuarios
 * @description Contiene las rutas de los usuarios
 */
router.use("/usuarios", usuario);

/**
 * @memberof routes/autenticacion
 * @name autenticacion
 * @description Contiene las rutas de la autenticacion
 */
router.use("/autenticacion", autenticacion);

/**
 * @memberof routes/bancos
 * @name bancos
 * @description Contiene las rutas del bancos
 */
router.use("/bancos", bancos);

/**
 * @memberof routes/profesiones
 * @name profesiones
 * @description Contiene las rutas de las profesiones
 */
router.use("/profesiones", profesiones);

/**
 * @memberof routes/cuentas
 * @name cuentas
 * @description Contiene las rutas de las cuentas
 */
router.use("/cuentas", cuentas);

/**
 * @memberof routes/pos
 * @name pos
 * @description Contiene las rutas de las cuentas
 */
router.use("/pos", pos);

/**
 * @memberof routes/lugares
 * @name lugares
 * @description Contiene las rutas de los lugares
 */
router.use("/lugares", lugares);

/**
 * @memberof routes/municipios
 * @name municipios
 * @description Contiene las rutas de los municipios
 */
router.use("/municipios", municipios);

/**
 * @memberof routes/departamentos
 * @name departamentos
 * @description Contiene las rutas de los departamentos
 */
router.use("/departamentos", departamentos);

/**
 * @memberof routes/paises
 * @name paises
 * @description Contiene las rutas de los departamentos
 */
router.use("/paises", paises);

/**
 * @memberof routes/cajas
 * @name cajas
 * @description Contiene las rutas de los cajas
 */
router.use("/cajas", cajas);

/**
 * @memberof routes/cajas
 * @name cajas
 * @description Contiene las rutas de los cajas
 */
router.use("/aperturas", aperturas);

/**
 * @memberof routes/estaciones
 * @name cajas
 * @description Contiene las rutas de las estaciones
 */
router.use("/estaciones", estaciones);

/**
 * @memberof routes/cierres
 * @name cajas
 * @description Contiene las rutas de las estaciones
 */
router.use("/cierres", cierres);

/**
 * @memberof routes/pagos
 * @name cajas
 * @description Contiene las rutas de los pagos
 */
router.use("/pagos", pagos);

module.exports = router;