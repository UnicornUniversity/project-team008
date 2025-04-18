const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization-x"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Chybí token v hlavičce (authorization-x)" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "tajnyklíč", (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Neplatný nebo expirovaný token" });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
