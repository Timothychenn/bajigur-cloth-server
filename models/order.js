'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.Order_item)
      Order.belongsTo(models.Address)
    }
  };
  Order.init({
    UserId: DataTypes.INTEGER,
    AddressId: {
      type: DataTypes.INTEGER,
      validate: {
          notEmpty: {
              args: true,
              msg: "Address id is required!",
          },
      },
  },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });

  Order.beforeCreate((instance, options) => {
    if (instance.status === "" || !instance.status) {
      instance.status = "pending";
    }
  })
  return Order;
};