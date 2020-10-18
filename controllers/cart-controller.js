const { Shopping_cart } = require("../models/index.js");

class ShoppingCartController {
    static async create(req, res, next) {
        let { productOptionID, quantity } = req.body;
        let currentUser = req.currentUser;

        try {
            let newShoppingCart = await Shopping_cart.create({
                UserId: currentUser.id,
                ProductOptionId: productOptionID,
                quantity,
            });

            res.status(201).json({
                id: newShoppingCart.id,
                UserId: newShoppingCart.UserId,
                ProductOptionId: newShoppingCart.ProductOptionId,
                quantity: newShoppingCart.quantity,
            });
        } catch (err) {
            next(err);
        }
    }

    static async readByUserId(req, res, next) {
        let userID = Number(req.params.id);

        try {
            let allShoppingCart = await Shopping_cart.findAll({
                where: {
                    UserId: userID,
                },
            });

            if (allShoppingCart.length > 0) {
                res.status(200).json({ shoppingCart: allShoppingCart });
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let shoppingCartID = Number(req.params.id);

        try {
            let currentShoppingCart = await Shopping_cart.findOne({
                where: {
                    id: shoppingCartID,
                },
            });

            if (currentShoppingCart) {
                res.status(200).json(currentShoppingCart);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        let { productOptionID, quantity } = req.body;
        let shoppingCartID = Number(req.params.id);

        try {
            let currentShoppingCart = await Shopping_cart.findOne({
                where: {
                    id: shoppingCartID,
                },
            });

            if (currentShoppingCart) {
                let updatedShoppingCart = await Shopping_cart.update(
                    {
                        ProductOptionId: productOptionID,
                        quantity,
                    },
                    {
                        where: {
                            id: shoppingCartID,
                        },
                        returning: true,
                    }
                );

                res.status(200).json(updatedShoppingCart[1][0]);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let shoppingCartID = Number(req.params.id);

        try {
            let currentShoppingCart = await Shopping_cart.destroy({
                where: {
                    id: shoppingCartID,
                },
            });

            if (currentShoppingCart) {
                res.status(200).json({ message: "Shopping cart item deleted" });
            } else {
                throw {name: "Not Found"}
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ShoppingCartController;
