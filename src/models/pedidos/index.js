const Pedido = require('./pedido');

/**
 * @module pedido
 * @description Lista de modelos del módulo de alquiler
 */
exports.Pedido = async () => {
    // Definición y relación de modelos de pedido
    await Pedido.sync().then(() => {
        console.log('Modelo Pedido creado correctamente');
    })
    .catch((err) => {
        console.log("Error al crear el modelo Pedido");
        console.log(err);
    });
};