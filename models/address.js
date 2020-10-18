"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Address.init(
        {
            UserId: DataTypes.INTEGER,
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Name is required!",
                    },
                },
            },
            address_name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Address name is required!",
                    },
                },
            },
            address: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Address is required!",
                    },
                },
            },
            postcode: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Postcode is required!",
                    },
                    isNumeric: {
                        args: true,
                        msg: "Please input a valid postcode!",
                    },
                    len: {
                      args: [5,5],
                      msg: "Please input a valid postcode with 5 number!"
                    }
                },
            },
            city: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "City is required!",
                    },
                },
            },
            phone: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Phone is required!",
                    },
                },
            },
        },
        {
            sequelize,
            modelName: "Address",
        }
    );
    return Address;
};
