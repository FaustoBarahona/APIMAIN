const { Empleados } = require('./empleados');
const { Configuracion } = require('./configuracion');
const { Cajas } = require('./cajas');
const { Bancos } = require('./bancos');
const { Clientes } = require('./clientes')
const { Pagos } = require('./pagos');
const { Lugares } = require('./lugares');
const { Pedido } = require('./pedidos');
const { Insumos } = require('./insumos');
const { Proveedores } = require('./proveedores');
const { Inventario } = require('./inventario');

var { tablaAmortizacion } = require("../helpers/amortizacion");


exports.CrearModelos = () => {
  Lugares();
  Empleados();
  Configuracion();
  Cajas();
  Bancos();
  Clientes();
  Pagos();
  Pedido();
  Insumos();
  Proveedores();
  Inventario();
};