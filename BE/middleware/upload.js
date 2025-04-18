// /middlewares/upload.js
const multer = require("multer");
const path = require("path");

// Nastavení úložiště
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Cílová složka
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Vytvoření instance Multeru
const upload = multer({ storage });

module.exports = upload;
