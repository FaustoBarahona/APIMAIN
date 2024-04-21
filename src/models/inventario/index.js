const Inventario = require('./inventario');
const Insumos = require('../insumos/insumos');
const SalidaInventario = require('./salidainventario');
const Usuario = require('../empleados/usuario');

/**
 * @module inventario
 * @description Lista de modelos del módulo de inventario
 */
exports.Inventario = async () => {
    // Asociaciones entre modelos
    Insumos.hasMany(Inventario);
    Inventario.belongsTo(Insumos);

    Inventario.hasMany(SalidaInventario);
    SalidaInventario.belongsTo(Inventario);
    Usuario.hasMany(SalidaInventario); // Relación: un usuario puede hacer muchas salidas de inventario
    SalidaInventario.belongsTo(Usuario); // Relación: una Salida Inventario pertenece a un usuario

    // Definición y relación de modelos de insumos
    await Inventario.sync().then(() => {
        console.log('Modelo Inventario creado correctamente');
    })
        .catch((err) => {
            console.log("Error al crear el modelo Inventario");
            console.log(err);
        });

        await SalidaInventario.sync().then(() => {
            console.log('Modelo SalidaInventario creado correctamente');
        })
        .catch((err) => {
            console.log("Error al crear el modelo SalidaInventario");
            console.log(err);
        });
};

// Aquí podrías agregar más modelos y sus relaciones si es necesario
