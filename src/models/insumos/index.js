const Insumos = require('./insumos');
const CompraInsumos = require('./comprainsumos');
const Proveedor = require('../proveedores/proveedores');
const Caja = require('../cajas/caja');
const Usuario = require('../empleados/usuario');

/**
 * @module insumos
 * @description Lista de modelos del módulo de insumos
 */
exports.Insumos = async () => {
    // Asociaciones entre modelos
    Insumos.hasMany(CompraInsumos);
    CompraInsumos.belongsTo(Insumos);
    Proveedor.hasMany(CompraInsumos); // Relación: un proveedor puede tener muchos insumos
    CompraInsumos.belongsTo(Proveedor); // Relación: un insumo pertenece a un proveedor
    Caja.hasMany(CompraInsumos); // Relación: una caja puede tener muchos insumos
    CompraInsumos.belongsTo(Caja); // Relación: un insumo pertenece a una caja
    Usuario.hasMany(CompraInsumos); // Relación: un usuario puede hacer muchas compras de insumos
    CompraInsumos.belongsTo(Usuario); // Relación: una compra de insumos pertenece a un usuario
    // Definición y relación de modelos de insumos
    await Insumos.sync().then(() => {
        console.log('Modelo Insumos creado correctamente');
    })
    .catch((err) => {
        console.log("Error al crear el modelo Insumos");
        console.log(err);
    });

    await CompraInsumos.sync().then(() => {
        console.log('Modelo CompraInsumos creado correctamente');
    })
    .catch((err) => {
        console.log("Error al crear el modelo CompraInsumos");
        console.log(err);
    });
};

// Aquí podrías agregar más modelos y sus relaciones si es necesario
