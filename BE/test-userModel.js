const userModel = require("./models/userModel");

(async () => {
  const email = "testik@example.com";
  const password = "dummy";
  try {
    const result = await userModel.createUser(email, password);
    console.log("✅ Výsledek:", result);
  } catch (err) {
    console.error("❌ Chyba:", err.message, err.stack);
  }
})();
