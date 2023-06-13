const jwt = require("jsonwebtoken");
const pool = require("../Config/db");
JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get User From token id
      verifiedUser = await pool.query("SELECT * FROM users WHERE id = $1", [
        decoded.id,
      ]);

      next();
    } catch (error) {
      res.json({
        message: `${error.message}`,
        status: 401,
      });
    }
  }

  if (!token) {
    res.json({
      status: 404,
      message: "Not authorized, no token",
    });
  }
};

module.exports = { protect };
