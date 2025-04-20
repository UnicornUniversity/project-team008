const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

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

const updateById = async (id, updates) => {
  const conn = await pool.getConnection();
  try {
    const fields = [];
    const values = [];

    if (updates.fileName) {
      fields.push("fileName = ?");
      values.push(updates.fileName);
    }
    if (updates.hardwarePinHash) {
      fields.push("hardwarePinHash = ?");
      values.push(updates.hardwarePinHash);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE files SET ${fields.join(", ")} WHERE id = ?`;
    await conn.query(sql, values);

    const [updatedRows] = await conn.query("SELECT * FROM files WHERE id = ?", [
      id,
    ]);
    return updatedRows[0];
  } finally {
    conn.release();
  }
};

const deleteById = async (id) => {
  const [rows] = await db.query("DELETE FROM files WHERE id = ?", [id]);
  return rows;
};

module.exports = {
  createFile,
  getById,
  hasAccess,
  findByIdAndOwner,
  updateById,
  deleteById,
};
