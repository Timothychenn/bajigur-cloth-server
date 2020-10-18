const { Order_item } = require("../models/index.js");

class OrderItemController {
    static async create(req, res, next) {
        let { orderID, productOptionID, quantity } = req.body;

        try {
            let newOrderItem = await Order_item.create({
                OrderId: orderID,
                ProductOptionId: productOptionID,
                quantity,
            });

            res.status(201).json({
                id: newOrderItem.id,
                OrderId: newOrderItem.OrderId,
                ProductOptionId: newOrderItem.ProductOptionId,
                quantity: newOrderItem.quantity,
            });
        } catch (err) {
            next(err);
        }
    }

    static async readByOrderId(req, res, next) {
        let orderID = Number(req.params.id);

        try {
            let allOrderItem = await Order_item.findAll({
                where: {
                    OrderId: orderID,
                },
            });

            if (allOrderItem.length > 0) {
                res.status(200).json({ orderItems: allOrderItem });
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let orderItemID = Number(req.params.id);

        try {
            let currentOrderItem = await Order_item.findOne({
                where: {
                    id: orderItemID,
                },
            });

            if (currentOrderItem) {
                res.status(200).json(currentOrderItem);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        let { orderID, productOptionID, quantity } = req.body;
        let orderItemId = Number(req.params.id);

        try {
            let currentOrderItem = await Order_item.findOne({
                where: {
                    id: orderItemId,
                },
            });

            if (currentOrderItem) {
                let updatedOrderItem = await Order_item.update(
                    {
                        OrderId: orderID,
                        ProductOptionId: productOptionID,
                        quantity,
                    },
                    {
                        where: {
                            id: orderItemId,
                        },
                        returning: true,
                    }
                );

                res.status(200).json(updatedOrderItem[1][0]);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let orderItemID = Number(req.params.id);

        try {
            let currentOrderitem = await Order_item.destroy({
                where: {
                    id: orderItemID,
                },
            });

            if (currentOrderitem) {
                res.status(200).json({ message: "Order item deleted" });
            } else {
                throw {name: "Not Found"}
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = OrderItemController;
