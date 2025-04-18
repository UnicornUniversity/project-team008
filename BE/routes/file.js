const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.js");
const upload = require("../middleware/upload");
const fileController = require("../controllers/fileController");

router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  fileController.uploadFile
);

router.get("/", authenticateToken, fileController.getFiles);

router.get("/:id", authenticateToken, fileController.getFileById);

router.put("/:id", authenticateToken, fileController.updateFile);

router.delete("/:id", authenticateToken, fileController.deleteFile);

module.exports = router;
