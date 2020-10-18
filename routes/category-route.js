const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category-controller");

const {
    authentication,
    admin_authorization
} = require("../middlewares/auth.js");

router.post("/", authentication, admin_authorization, CategoryController.create);
router.get("/", CategoryController.read);
router.get("/:id", CategoryController.readById);
router.put("/:id", authentication, admin_authorization, CategoryController.update);
router.delete("/:id", authentication, admin_authorization, CategoryController.delete);

module.exports = router;
