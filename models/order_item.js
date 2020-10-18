'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_item.belongsTo(models.Product_option)
    }
  };
  Order_item.init({
    OrderId: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Order id is required!",
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
    modelName: 'Order_item',
  });
  return Order_item;
};