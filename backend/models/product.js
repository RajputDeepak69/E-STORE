const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Product;