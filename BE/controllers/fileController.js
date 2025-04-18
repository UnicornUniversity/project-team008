const path = require("path");
const fileModel = require("../models/fileModel");
const db = require("../config/db");

const getFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 getFiles zavolán pro uživatele:", userId);

    const [results] = await db.query("SELECT * FROM files WHERE owner = ?", [
      userId,
    ]);

    console.log("✅ Výsledky:", results);
    return res.status(200).json(results);
  } catch (err) {
    console.error("❌ Chyba při získávání souborů:", err);
    return res
      .status(500)
      .json({ message: "Server error při získávání souborů" });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Soubor nebyl nahrán" });
    }

    const { filename, size, path: filePath } = req.file;
    const ownerId = req.user.id;

    // uložit metadata do DB
    const newFile = await fileModel.createFile({
      fileName: filename,
      localUrl: filePath,
      size,
      owner: ownerId,
      created_by: ownerId,
    });

    res.status(201).json(newFile);
  } catch (err) {
    console.error("Chyba při uploadu souboru:", err);
    res.status(500).json({ message: "Chyba serveru při nahrávání souboru" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};
