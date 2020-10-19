const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order-controller");

const {
    authentication,
    order_authorization,
    admin_authorization
} = require("../middlewares/auth.js");

router.post("/", authentication, OrderController.create);
router.get("/", authentication, OrderController.read);
router.get("/:id", authentication, order_authorization, OrderController.readById);
router.put("/:id", authentication, admin_authorization, order_authorization, OrderController.updateStatus);
router.delete("/:id", authentication, admin_authorization, order_authorization, OrderController.delete);

module.exports = router;
