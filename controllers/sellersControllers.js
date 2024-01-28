const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
JWT_SECRET = process.env.JWT_SECRET;
const pool = require("../config/db");
const sendEmail = require("../utils/Email");

//TODO: ======================================================== Register User ========================================================

// desc Register User
// @route post /seller/register
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

    // activation link

    // if user exists, resend activation link
    if (user.rows.length > 0) {
      const activationLink = `https://portfolio-v2-three-murex.vercel.app/activation?email=${user.rows[0].email}&token=${user.rows[0].token}`;

      const linkHtml = `
      <a href="${activationLink}" style="background-color: #0d6efd;
      color: #ffffff;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      border-radius: 6px;
      ">Activate Account</a>`;

      const html = `<p style="font-size: 1.5rem;>Hi ${user.rows[0].last_name}, Click on the button below to activate your account. Link expires in 1hr.</p> <br>${linkHtml}</br>`;
      const tittle = "Welcome to the Justlink family";

      await sendEmail(
        // to:
        user.rows[0].email,
        // subject:
        tittle,
        // html message:
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
        const activationLink = `https://portfolio-v2-three-murex.vercel.app/activation?email=${newUser.rows[0].email}&token=${newUser.rows[0].token}`;

        const linkHtml = `
        <a href="${activationLink}" style="background-color: #0d6efd;
        color: #ffffff;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          border-radius: 6px;
        ">Activate Account</a>`;

        const html = `<p  style="font-size: 1.5rem;">Hi ${newUser.rows[0].last_name}, Click on the button below to activate your account. Link expires in 1hr.</p> <br>${linkHtml}</br>`;
        const tittle = "Welcome to the Justlink family";

        await sendEmail(
          // to:
          newUser.rows[0].email,
          // subject:
          tittle,
          // html message:
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

//POST /admin/activate
//@desc  Activate user Account
//@ public
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
        "UPDATE sellers SET activated = true WHERE email = $1 RETURNING *",
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
// @route post /admin/login
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
        user: {
          id: user.rows[0].id,
          first_name: user.rows[0].first_name,
          last_name: user.rows[0].last_name,
          email: user.rows[0].email,
          company_name: user.rows[0].company_name,
          country: user.rows[0].country,
          contact: user.rows[0].contact,
          business_category: user.rows[0].business_category,
          activated: user.rows[0].activated,
          created_at: user.rows[0].created_at,
        },
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
// @access private
const updateSeller = async (req, res) => {
  try {
    const {
      id = req.user.id,
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
// @route get /api/user
// @access private
const getUser = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM sellers WHERE id = $1", [
      req.user.id,
    ]);

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    } else {
      res.json({
        status: 200,
        message: "Successfully fetched user",
        user: {
          id: user.rows[0].id,
          first_name: user.rows[0].first_name,
          last_name: user.rows[0].last_name,
          email: user.rows[0].email,
          company_name: user.rows[0].company_name,
          country: user.rows[0].country,
          contact: user.rows[0].contact,
          business_category: user.rows[0].business_category,
          activated: user.rows[0].activated,
          created_at: user.rows[0].created_at,
        },
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
    const { id } = req.body;

    const { oldPassword, newPassword } = req.body;

    //  get the user from the database
    const user = await pool.query(
      "SELECT id,first_name,last_name, email, role,created_at  FROM sellers WHERE id = $1",
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
        "UPDATE sellers SET password = $1 WHERE id = $2 RETURNING *",
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

// TODO: ========================================= Forgot Password =========================================
// desc Change User Password
// @route post /api/user/forgot-password/:id
// @access private
const forgotPassword = async (req, res) => {
  // forgot password
  try {
    const { email } = req.body;

    //  get the user from the database
    const user = await pool.query("SELECT * FROM sellers WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    }

    // generate token
    const token = generateToken(user.rows[0].id);

    // update user
    const updatedUser = await pool.query(
      "UPDATE sellers SET token = $1 WHERE email = $2 RETURNING *",
      [token, email]
    );

    const resetLink = `http://localhost:3000/reset-password?email=${updatedUser.rows[0].email}&token=${updatedUser.rows[0].token}`;

    const linkHtml = `
    <a href="${resetLink}" style="background-color: #0d6efd;
    color: #ffffff;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    border-radius: 6px;
    ">Reset Password</a>`;

    const html = `<p  style="font-size: 1.5rem;">Hi ${updatedUser.rows[0].last_name}, Click on the button below to reset your password. Link expires in 1hr.</p> <br>${linkHtml}</br>`;
    const tittle = "Forgot Password";

    await sendEmail(
      // to:
      updatedUser.rows[0].email,
      // subject:
      tittle,
      // html message:
      html
    );

    res.json({
      status: 200,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};
// TODO: ========================================= Reset Password =========================================
// desc Change User Password
// @route post /api/user/change-password/:id
// @access private
const resetPassword = async (req, res) => {
  // Reset password
  try {
    const { email, token, newPassword } = req.body;

    //  get the user from the database
    const user = await pool.query("SELECT * FROM sellers WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    }

    // check if token is valid
    if (user.rows[0] && user.rows[0].token === token) {
      // hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // update user
      const updatedUser = await pool.query(
        "UPDATE sellers SET password = $1 WHERE email = $2 RETURNING *",
        [hashedPassword, email]
      );

      res.json({
        status: 200,
        message: "Password updated successfully",
        updatedUser: updatedUser.rows[0],
      });
    } else {
      res.json({
        status: 400,
        message: "Invalid token or email",
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
  resetPassword,
  registerSeller,
  changePassword,
  activateSeller,
  forgotPassword,
};
