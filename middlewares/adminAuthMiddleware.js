const jwt = require("jsonwebtoken");
const pool = require("../config/db");
JWT_SECRET = process.env.JWT_SECRET;

const adminPrivilege = async (req, res, next) => {
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

      // Get User From token
      verifiedUser = await pool.query("SELECT * FROM admin WHERE id = $1", [
        decoded.id,
      ]);

      // Add user from payload
      req.user = verifiedUser.rows[0];

      // checks if user is a super admin and has all privileges then next()
      if (req.user.role === "super-admin") {
        next();
      } else {
        res.json({
          message: "You are not authorized to perform this action",
          status: 401,
        });
      }
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

module.exports = { adminPrivilege };
