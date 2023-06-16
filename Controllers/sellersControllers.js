const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
JWT_SECRET = process.env.JWT_SECRET;
const pool = require("../Config/db");
const sendEmail = require("../Utils/Email");

//TODO: ======================================================== Register User ========================================================

// desc Register User
// @route post /api/user/register
// @access public
const registerSeller = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    company_name,
    country,
    contact,
    business_category,
  } = req.body;

  try {
    // check if user already exists
    const user = await pool.query("SELECT * FROM sellers WHERE email = $1", [
      email,
    ]);

    // if user exists, resend activation link
    if (user.rows.length > 0) {
      const activationLink = `http://localhost:5000/api/v1/activate_user?email=${user.rows[0].email}&token=${user.rows[0].token}`;

      const linkHtml = `
      <a href="${activationLink}" style="background-color: #4CAF50;
      border: none;
      color: white;
      padding: 15px 32px;
      margin: 15px 32px;
      text-align: center;
      text-decoration: none;">Activate Account</a>`;

      const html = `<p>Hi ${user.rows[0].last_name}, Click on the button below to activate your account. Link expires in 1hr.</p> <br>${linkHtml}</br>`;
      const tittle = "Welcome to Attendance App for Roscareer";
      const message =
        "Email already used, check your email for the activation link";

      await sendEmail(
        // to:
        user.rows[0].email,
        // subject:
        tittle,
        // text:
        message,
        // html:
        html
      );

      res.json({
        status: 201,
        message: `Email already used, check ${user.rows[0].email} for the activation link `,
      });
    } else {
      // if user does not exist, create user

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      // insert user into database
      const newUser = await pool.query(
        "INSERT INTO sellers (first_name, last_name, email, password,company_name,country,contact,business_category,token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          first_name,
          last_name,
          email,
          encryptedPassword,
          company_name,
          country,
          contact,
          business_category,
          (token = generateToken(password)),
        ]
      );

      if (newUser.rows[0]) {
        const activationLink = `http://localhost:5000/api/v1/activate_user?email=${newUser.rows[0].email}&token=${newUser.rows[0].token}`;

        const linkHtml = `
        <a href="${activationLink}" style="background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        margin: 15px 32px;
        text-align: center;
        text-decoration: none;">Activate Account</a>`;

        const html = `<p>Hi ${newUser.rows[0].last_name}, Click on the button below to activate your account. Link expires in 1hr.</p> <br>${linkHtml}</br>`;
        const tittle = "Welcome to Attendance App for Roscareer";
        const message =
          "Thank you for registering with us. Please click on the button below to activate your account. Link expires in 1hr.";

        await sendEmail(
          // to:
          newUser.rows[0].email,
          // subject:
          tittle,
          // text:
          message,
          // html:
          html
        );

        res.json({
          status: 201,
          message: `activation link sent to ${newUser.rows[0].email}`,
        });
      }
    }
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

//TODO: =================================================================== ACTIVATE A NEW USER ===================================================================

//POST /activate/${email}&${token}
//@desc  Verify shopper email
//@ private
const activateSeller = async (req, res) => {
  const { email, token } = req.body;
  // find user
  const user = await pool.query("SELECT * FROM sellers WHERE email = $1", [
    email,
  ]);

  try {
    if (user.rows[0] && user.rows[0].token === token) {
      //  update current user activated column as true and token as null
      const updatedUser = await pool.query(
        "UPDATE users SET activated = true WHERE email = $1 RETURNING *",
        [email]
      );

      res.json({
        status: 200,
        message: "Successfully verified user account",
      });
    } else {
      res.json({
        status: 400,
        message: "Invalid token or email",
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// TODO: ======================================================== Login User ========================================================

// desc Login User
// @route post /api/v1/login
// @access public
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await pool.query("SELECT * FROM sellers WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "Invalid email address",
      });
    }

    // if user exists, compare password
    if (user && (await bcrypt.compare(password, user.rows[0].password))) {
      res.status(200).json({
        status: 200,
        message: "Successfully logged in",
        user: user.rows[0],
        token: generateToken(user.rows[0].id),
      });
    } else {
      res.json({
        status: 400,
        message: "Invalid password",
      });
      return;
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ======================================================== Update User ========================================================

// desc Update User
// @route post /api/v1/update
// @access public
const updateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      company_name,
      country,
      contact,
      business_category,
    } = req.body;

    //  get the user from the database
    const user = await pool.query("SELECT * FROM sellers WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    }

    // update user
    const updatedUser = await pool.query(
      "UPDATE sellers SET first_name = $1, last_name = $2, email = $3, company_name = $4, country = $5, contact = $6, business_category = $7  WHERE id = $8 RETURNING *",
      [
        first_name,
        last_name,
        email,
        company_name,
        country,
        contact,
        business_category,
        id,
      ]
    );

    res.json({
      status: 200,
      message: "User updated successfully",
      updatedUser: updatedUser.rows[0],
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

//TODO: ======================================================== Get  User ========================================================
// desc Get User
// @route get /api/user/:id
// @access private
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    } else {
      res.json({
        status: 200,
        message: "Successfully fetched user",
        user: user.rows[0],
      });
    }
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Change user Password =========================================
// desc Change User Password
// @route post /api/user/change-password/:id
// @access private
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const { oldPassword, newPassword } = req.body;

    //  get the user from the database
    const user = await pool.query(
      "SELECT id,first_name,last_name, email, role,created_at  FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    }

    // check if old password is correct
    if (user && (await bcrypt.compare(oldPassword, user.rows[0].password))) {
      // hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // update user
      const updatedUser = await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
        [hashedPassword, id]
      );

      res.json({
        status: 200,
        message: "Password updated successfully",
        updatedUser: updatedUser.rows[0],
      });
    } else {
      res.json({
        status: 400,
        message: "Invalid old password",
      });
      return;
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Generate token =========================================

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = {
  getUser,
  loginSeller,
  updateSeller,
  registerSeller,
  changePassword,
  activateSeller,
};
