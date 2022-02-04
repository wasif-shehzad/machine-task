const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/middleware");

router.post("/verify-token", authenticate, authController.verifyToken);

module.exports = router;
