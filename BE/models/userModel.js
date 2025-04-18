const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

async function createUser(email, hashedPassword, role = "user") {
  const id = uuidv4();
  const [result] = await pool.query(
    `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`,
    [id, email, hashedPassword, role]
  );
  return { id, email, role };
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
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // nebo podle potřeby
      }
    );
  });
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  findByEmail,
};
