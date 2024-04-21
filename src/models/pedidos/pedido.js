const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Pedido = db.define('Pedido', {
    // Definición de los pedidos
    fechapedido: {
        type: Sequelize.STRING(50),
        allowNull: TransformStreamDefaultController,
    },
    nombrepedido: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    total: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
},
{
    tableName: "pedidos",
}
);

module.exports = Pedido;