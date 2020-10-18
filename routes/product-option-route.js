const express = require("express");
const router = express.Router();
const ProductOptionController = require("../controllers/product-option-controller");

const {
    authentication,
    admin_authorization
} = require("../middlewares/auth.js");

router.post("/", authentication, admin_authorization, ProductOptionController.create);
router.get("/product/:id", ProductOptionController.readByProductId);
router.get("/:id", ProductOptionController.readById);
router.put("/:id", authentication, admin_authorization, ProductOptionController.update);
router.delete("/:id", authentication, admin_authorization, ProductOptionController.delete);

module.exports = router;
