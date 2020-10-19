'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shopping_cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shopping_cart.belongsTo(models.Product_option)
    }
  };
  Shopping_cart.init({
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "User id is required!",
          },
      },
  },
    ProductOptionId: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Product option id is required!",
          },
      },
  },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Quantity is required!",
          },
          isNumeric: {
            args: true,
            msg: "Please input a valid quantity!",
        },
          min: {
            args: [0],
            msg: "Quantity minimum value is 0!"
          }
      },
  }
  }, {
    sequelize,
    modelName: 'Shopping_cart',
  });
  return Shopping_cart;
};