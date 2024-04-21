const Sequelize = require("sequelize");

const db = require("../../Config/db");

const ProveedorTelefono = db.define(
  "proveedortelefono",
  {
    numero: {
      type: Sequelize.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el numero de telefono." },
      },
    },
  },
  {
    tableName: "proveedortelefonos",
  }
);

module.exports = ProveedorTelefono;
