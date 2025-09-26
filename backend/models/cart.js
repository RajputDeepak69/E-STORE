const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const User = require("./user");
const Product = require("./product");

const Cart = sequelize.define("Cart", {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

// relations
User.hasMany(Cart);
Cart.belongsTo(User);
Product.hasMany(Cart);
Cart.belongsTo(Product);

module.exports = Cart;