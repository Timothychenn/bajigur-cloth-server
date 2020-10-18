const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product-controller");

const {
    authentication,
    admin_authorization
} = require("../middlewares/auth.js");

router.post("/", authentication, admin_authorization, ProductController.create);
router.get("/", ProductController.read);
router.get("/:id", ProductController.readById);
router.put("/:id", authentication, admin_authorization, ProductController.update);
router.delete("/:id", authentication, admin_authorization, ProductController.delete);

module.exports = router;
