const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

async function createFile({ fileName, localUrl, size, owner, created_by }) {
  const id = uuidv4();
  const [result] = await pool.query(
    `INSERT INTO files (id, fileName, localUrl, size, owner, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, fileName, localUrl, size, owner, created_by]
  );

  return {
    id,
    fileName,
    localUrl,
    size,
    owner,
    created_by,
    created_at: new Date(),
  };
}

async function getById(id) {
  const [rows] = await pool.query("SELECT * FROM file WHERE id = ?", [id]);
  return rows[0];
}

const findByIdAndOwner = async (id, ownerId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM files WHERE id = ? AND owner = ?",
      [id, ownerId]
    );
    return rows[0];
  } finally {
    conn.release();
  }
};

async function hasAccess(fileId, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM file_access WHERE fileId = ? AND userId = ?",
    [fileId, userId]
  );
  return rows.length > 0;
}

module.exports = { createFile, getById, hasAccess, findByIdAndOwner };
