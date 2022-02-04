const router = require("express").Router();
const jwt = require("./utils/jwt");

const user = require("./routes/user.routes");
const auth = require("./routes/auth.routes");

router.use("/user", user);
router.use("/auth", auth);

module.exports = router;
