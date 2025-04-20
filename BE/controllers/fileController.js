const path = require("path");
const fileModel = require("../models/fileModel");
const db = require("../config/db");
const fs = require("fs");

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

const getFileById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  console.log("🔍 getFileById zavolán pro ID:", id);

  try {
    const file = await fileModel.findByIdAndOwner(id, userId);
    if (!file) {
      return res.status(404).json({ message: "Soubor nebyl nalezen" });
    }

    res.status(200).json(file);
  } catch (err) {
    console.error("❌ Chyba v getFileById:", err);
    res.status(500).json({ message: "Chyba serveru" });
  }
};

const updateFile = async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;
  const { fileName, hardwarePinHash } = req.body;

  console.log("🛠️ updateFile zavolán:", fileId, "uživatel:", userId);

  try {
    const file = await fileModel.findByIdAndOwner(fileId, userId);
    if (!file) {
      return res
        .status(403)
        .json({ message: "Nemáte oprávnění upravovat tento soubor" });
    }

    const updated = await fileModel.updateById(fileId, {
      fileName,
      hardwarePinHash,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Chyba při aktualizaci souboru:", err);
    res.status(500).json({ message: "Chyba serveru při aktualizaci" });
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;

  console.log("🗑️ deleteFile zavolán", fileId, "uživatel:", userId);

  try {
    const file = await fileModel.findByIdAndOwner(fileId, userId);
    if (!file) {
      return res
        .status(404)
        .json({ message: "Soubor nenalezen nebo přístup odepřen" });
    }

    await fileModel.deleteById(fileId);

    const filePath = path.join(__dirname, "..", file.localUrl);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn(
          "⚠️ Soubor v souborovém systému nebyl nalezen nebo již byl smazán:",
          err.message
        );
      }
    });

    res.status(204).send();
  } catch (err) {
    console.error("❌ Chyba v deleteFile:", err);
    res.status(500).json({ message: "Chyba serveru" });
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
  getFileById,
  updateFile,
  deleteFile,
};
