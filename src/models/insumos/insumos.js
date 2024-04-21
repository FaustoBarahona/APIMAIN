const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Insumos = db.define(
    'Insumos', 
{
    // Definición de los insumos
    nombre: {
        type: Sequelize.STRING(30),
        allowNull: true,
    },
    descripcion: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
},
{
    tableName: "insumos",
}
);

module.exports = Insumos;