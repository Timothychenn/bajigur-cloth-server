'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product_option.init({
    ProductId: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Product id is required!",
          },
      },
  },
    size: {
      type: DataTypes.STRING,
      validate: {
          notEmpty: {
              args: true,
              msg: "Size is required!",
          },
      },
  },
    color: {
      type: DataTypes.STRING,
      validate: {
          notEmpty: {
              args: true,
              msg: "Color is required!",
          },
      },
  },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Stock is required!",
          },
          min: {
            args: [0],
            msg: "Stock minimum value is 0!"
          }
      },
  },
    photo_link: {
      type: DataTypes.STRING,
      validate: {
          notEmpty: {
              args: true,
              msg: "Photo's link is required!",
          },
          isUrl: {
            args: true,
            msg: "Please input a valid photo link!"
          }
      },
  }
  }, {
    sequelize,
    modelName: 'Product_option',
  });
  return Product_option;
};