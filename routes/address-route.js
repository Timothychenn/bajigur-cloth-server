const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/address-controller");

const {
    authentication,
    address_authorization,
} = require("../middlewares/auth.js");

router.post("/", authentication, AddressController.create);
router.get("/", authentication, AddressController.read);
router.get("/:id", authentication, address_authorization, AddressController.readById);
router.put("/:id", authentication, address_authorization, AddressController.update);
router.delete("/:id", authentication, address_authorization, AddressController.delete);

module.exports = router;
