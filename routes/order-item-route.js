const express = require("express");
const router = express.Router();
const OrderItemController = require("../controllers/order-item-controller");

const {
    authentication
} = require("../middlewares/auth.js");

router.post("/", authentication, OrderItemController.create);
router.get("/order/:id", authentication, OrderItemController.readByOrderId);
router.get("/:id", authentication, OrderItemController.readById);
router.put("/:id", authentication, OrderItemController.update);
router.delete("/:id", authentication, OrderItemController.delete);

module.exports = router;
