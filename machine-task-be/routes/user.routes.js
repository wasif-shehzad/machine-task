const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/middleware");
const fileRoutes = require("./file.routes");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/getAll", authenticate, userController.getAll);
router.use("/file", authenticate, fileRoutes);

module.exports = router;
