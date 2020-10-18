const express = require("express");
const router = express.Router();
const ShoppingCartController = require("../controllers/cart-controller");

const {
    authentication,
    shopping_cart_authorization,
} = require("../middlewares/auth.js");

router.post("/", authentication, ShoppingCartController.create);
router.get("/user/:id", authentication, ShoppingCartController.readByUserId);
router.get("/:id", authentication, ShoppingCartController.readById);
router.put("/:id", authentication, shopping_cart_authorization, ShoppingCartController.update);
router.delete("/:id", authentication, shopping_cart_authorization, ShoppingCartController.delete);

module.exports = router;
