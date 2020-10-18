const { Order } = require("../models/index.js");

class OrderController {
    static async create(req, res, next) {
        let { addressID, status } = req.body;
        let currentUser = req.currentUser;
        
        try {
            let newOrder = await Order.create({
                AddressId: addressID,
                UserId: currentUser.id,
                status
            });

            res.status(201).json({
                status: newOrder.status,
                addressID: newOrder.AddressId,
                userID: newOrder.UserId,
            });
        } catch (err) {
            next(err);
        }
    }

    static async read(req, res, next) {
        let currentUser = req.currentUser;

        try {
            let allOrders = await Order.findAll({
                where: {
                    UserId: currentUser.id,
                },
            });

            res.status(200).json({ orders: allOrders });
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let orderID = Number(req.params.id);

        try {
            let curentOrder = await Order.findOne({
                where: {
                    id: orderID,
                },
            });

            res.status(200).json(curentOrder);
        } catch (err) {
            next(err);
        }
    }

    static async updateStatus(req, res, next) {
        let { status } = req.body;
        let orderID = Number(req.params.id);

        try {
            let updatedOrder = await Order.update(
                {
                    status,
                },
                {
                    where: {
                        id: orderID,
                    },
                    returning: true,
                }
            );

            res.status(200).json(updatedOrder[1][0]);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let orderID = Number(req.params.id);

        try {
            let currentOrder = await Order.destroy({
                where: {
                    id: orderID,
                },
            });

            res.status(200).json({ message: "Order deleted" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = OrderController;
