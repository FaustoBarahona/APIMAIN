const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Salidainventario = db.define('CompraInsumos', {
    // Definición de los insumos
    cantidadsalida: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fechasalida: {
        type: Sequelize.DATE, // Campo para almacenar la fecha de la compra
        allowNull: false,
        defaultValue: Sequelize.NOW // Valor por defecto: fecha y hora actual
    },
}, {
    tableName: "salidainventario",
});


module.exports = Salidainventario;
