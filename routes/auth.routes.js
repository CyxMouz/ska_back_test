const express = require("express");
const router = express.Router();
const authController = require("../controllers/Authentication.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/refresh", async (req, res) => {});
module.exports = router;
