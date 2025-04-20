const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const register = async (req, res) => {
  try {
    console.log("📨 register endpoint byl zavolán");

    const { email, password } = req.body;
    console.log("📝 Request body:", email, password);

    const existing = await userModel.findByEmail(email);
    if (existing) {
      console.log("⚠️ Uživatel už existuje:", existing.email);
      return res.status(409).json({ message: "Uživatel už existuje" });
    }

    console.log("🔐 Zahajuji hashování hesla...");
    const hashedPassword = await argon2.hash(password);
    console.log("✅ Heslo hashováno");

    console.log("📦 Odesílám uživatele do DB...");
    const user = await userModel.createUser(email, hashedPassword);
    console.log("✅ Uživatel uložen:", user);

    return res.status(201).json({ message: "Registrace úspěšná", user });
  } catch (err) {
    console.error("❌ Chyba při registraci:", err.message, err.stack);
    return res
      .status(500)
      .json({ message: "Chyba serveru", detail: err.message });
  }
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

    const match = await argon2.verify(user.password, password);

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

module.exports = { register, login };
