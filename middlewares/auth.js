const { verifyToken } = require("../helpers/token.js");
const { User, Address, Order, Shopping_cart, Order_item } = require("../models/index.js");

async function authentication(req, res, next) {
    let access_token = req.headers.access_token;

    if (access_token) {
        try {
            let payload = verifyToken(access_token);

            let currentUser = await User.findOne({
                where: {
                    email: payload.email,
                },
            });

            if (currentUser) {
                req.currentUser = currentUser;
                next();
            } else {
                throw { name: "Unauthorized User" };
            }
        } catch (err) {
            next(err);
        }
    } else {
        next({ name: "Unauthorized User" });
    }
}

async function address_authorization(req, res, next) {
    let currentUser = req.currentUser;
    let addressID = Number(req.params.id);

    try {
        let currentAddress = await Address.findOne({
            where: {
                id: addressID,
            },
        });
        
        if (currentAddress) {
            if (currentAddress.UserId === currentUser.id) {
                next();
            } else {
                throw { name: "Forbidden" };
            }
        } else {
            throw { name: "Not Found" };
        }
    } catch (err) {
        next(err);
    }
}

async function order_authorization(req, res, next) {
    let currentUser = req.currentUser;
    let orderID = Number(req.params.id);

    try {
        let currentOrder = await Order.findOne({
            where: {
                id: orderID,
            },
        });
        
        if (currentOrder) {
            if (currentOrder.UserId === currentUser.id || currentUser.type === "admin") {
                next();
            } else {
                throw { name: "Forbidden" };
            }
        } else {
            throw { name: "Not Found" };
        }
    } catch (err) {
        next(err);
    }
}

async function shopping_cart_authorization(req, res, next) {
    let currentUser = req.currentUser;
    let shoppingCartID = Number(req.params.id);

    try {
        let currentShoppingCart = await Shopping_cart.findOne({
            where: {
                id: shoppingCartID,
            },
        });

        if (currentShoppingCart) {
            if (currentShoppingCart.UserId === currentUser.id) {
                next();
            } else {
                throw { name: "Forbidden" };
            }
        } else {
            throw { name: "Not Found" };
        }
    } catch (err) {
        next(err);
    }
}

async function admin_authorization(req, res, next) {
    let currentUser = req.currentUser

    try {
        let userData = await User.findOne({
            where: {
                id: currentUser.id
            }
        })
        if (userData.type === "admin") {
            next()
        } else {
            throw { name: "Forbidden" }
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    authentication,
    address_authorization,
    order_authorization,
    shopping_cart_authorization,
    admin_authorization,
};
