'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Product_option)
    }
  };
  Product.init({
    CategoryId: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Category id is required!",
          },
      },
  },
    name: {
      type: DataTypes.STRING,
      validate: {
          notEmpty: {
              args: true,
              msg: "Name is required!",
          },
      },
  },
    price: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Price is required!",
          },
          isNumeric: {
            args: true,
            msg: "Please input a valid price!",
        },
          min: {
            args: [1],
            msg: "Price minimum value is 1!"
          }
      },
  },
    description: {
      type: DataTypes.STRING,
      validate: {
          notEmpty: {
              args: true,
              msg: "Description is required!",
          },
      },
  }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};