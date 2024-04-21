const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Comprainsumos = db.define('CompraInsumos', {
    // Definición de los insumos
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    unidadmedida: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    preciounitario: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    subtotal: {
        type: Sequelize.FLOAT, // Campo para almacenar el sub total
        allowNull: false,
    },
    fechacompra: {
        type: Sequelize.DATE, // Campo para almacenar la fecha de la compra como string
        allowNull: true,
    },
    tipopago: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    totalcompra: {
        type: Sequelize.FLOAT, // Campo para almacenar el total de la compra
        allowNull: false,
    },
    documentofactura: {
        type: Sequelize.STRING, // Campo para almacenar la foto o documento de la factura
        allowNull: true, // Opciones dependiendo de tus requerimientos
        defaultValue: "FacturaSinImagen.png",
    },
}, {
    tableName: "comprainsumos",
});


module.exports = Comprainsumos;
