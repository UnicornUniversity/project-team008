const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email a heslo jsou povinné" });
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    return res
      .status(409)
      .json({ message: "Uživatel s tímto emailem již existuje" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create(email, hashedPassword);

  res.status(201).json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email a heslo jsou povinné" });
  }

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Neplatné přihlašovací údaje" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Neplatné přihlašovací údaje" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "tajnyklíč",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Chyba serveru" });
  }
};

module.exports = { login };
module.exports = { register, login };
