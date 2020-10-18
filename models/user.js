"use strict";

const { hashPassword } = require("../helpers/hash-password");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.Address);
            User.hasMany(models.Order);
            User.hasOne(models.Shopping_cart);
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Email is required!",
                    },
                    isEmail: {
                        args: true,
                        msg: "Please input a valid email!",
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Password is required!",
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
            type: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );

    User.beforeCreate((instance, options) => {
        instance.password = hashPassword(instance.password);
        if (instance.type === "") {
            instance.type = "user";
        }
    });
    return User;
};
