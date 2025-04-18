const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/file", require("./routes/file"));

// Root test
app.get("/", (req, res) => {
  res.send("SecureDoc API is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// DB Test
const pool = require("./config/db");

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
  });
