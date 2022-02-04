const express = require("express");
const router = express.Router();

const fileController = require("../controllers/file.controller");
const authenticate = require("../middlewares/middleware");
const { multerUploadFile } = require("../utils/multerUploadFile");

router.post(
  "/uploadFile",
  multerUploadFile.single("file"),
  fileController.uploadFile
);

router.post("/getAll", fileController.getAll);
router.post("/editFilePermissions", fileController.editFilePermission);

router.post("/checkfilepermission", fileController.checkFilePermission);

router.post("/viewFile", fileController.getFile);

module.exports = router;
