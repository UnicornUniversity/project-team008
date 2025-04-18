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

module.exports = { createFile };
