const Proveedor = require('./proveedores');
const ProveedorTelefono = require('./proveedortelefono');
const Lugar = require('../lugares/lugar');

/**
 * @module proveedor
 * @description Lista de modelos del módulo de proveedor
 */
exports.Proveedores = async () => {
    Lugar.hasMany(Proveedor);
    Proveedor.belongsTo(Lugar);
    Proveedor.hasMany(ProveedorTelefono);
    ProveedorTelefono.belongsTo(Proveedor);
    // Definición y relación de modelos de pedido
    await Proveedor.sync().then(() => {
        console.log('Modelo Proveedor creado correctamente');
    })
        .catch((err) => {
            console.log("Error al crear el modelo Proveedor");
            console.log(err);
        });
        await ProveedorTelefono.sync().then(() => {
            console.log('Modelo ProveedorTelefono creado correctamente');
        })
            .catch((err) => {
                console.log("Error al crear el modelo ProveedorTelefono");
                console.log(err);
            });
};