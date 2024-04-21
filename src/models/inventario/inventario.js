const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Inventario = db.define('Inventario', {
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: "inventario"
});

module.exports = Inventario;
