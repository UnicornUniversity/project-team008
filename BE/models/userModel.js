const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

async function createUser(email, hashedPassword, role = "user") {
  const id = uuidv4();
  try {
    console.log("🛠️ INSERT uživatele:", email);
    const [result] = await pool.query(
      `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`,
      [id, email, hashedPassword, role]
    );
    console.log("✅ Uživatel zapsán do DB");
    return { id, email, role };
  } catch (err) {
    console.error("❌ Chyba v createUser:", err.message, err.stack);
    throw err;
  }
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows[0];
}

async function getUserById(id) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
}

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  findByEmail,
};
