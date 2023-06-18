const bcrypt = require("bcryptjs");
JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const pool = require("../Config/db");

//TODO: ======================================================== Register User ========================================================

// desc Register User
// @route post /api/user/register
// @access public
const registerAdmin = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    // check if user already exists
    const user = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

    // if user exists, resend activation link
    if (user.rows.length > 0) {
      res.json({
        status: 201,
        message: `Email already used, please login`,
      });
    } else {
      // if user does not exist, create user

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      // insert user into database
      const newUser = await pool.query(
        "INSERT INTO admin (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [first_name, last_name, email, encryptedPassword, role]
      );

      if (newUser.rows[0]) {
        res.json({
          status: 201,
          message: `Successfully registered`,
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

// TODO: ======================================================== Login User ========================================================

// desc Login User
// @route post /api/v1/login
// @access public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await pool.query("SELECT * FROM admin WHERE email = $1", [
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

//TODO: ======================================================== Get All Sellers ========================================================

// desc Get All Users
// @route get /api/user/all
// @access private
const getAllSellers = async (req, res) => {
  try {
    const allSellers = await pool.query(
      "SELECT id,first_name,last_name, email, company_name,country,contact,business_category,created_at,activated FROM sellers"
    );

    res.json({
      status: 200,
      message: "Successfully fetched all users",
      allSellers: allSellers.rows,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

//TODO: ======================================================== Get All Shoppers ========================================================

// desc Get All Users
// @route get /api/user/all
// @access private
const getAllShoppers = async (req, res) => {
  try {
    const allShoppers = await pool.query(
      "SELECT id, email, created_at,activated FROM shoppers"
    );

    res.json({
      status: 200,
      message: "Successfully fetched all shoppers",
      allShoppers: allShoppers.rows,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

//TODO: ======================================================== Get All Products ========================================================

// desc Get All Users
// @route get /api/user/all
// @access private
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await pool.query("SELECT * FROM products");

    res.json({
      status: 200,
      message: "Successfully fetched all products",
      allProducts: allProducts.rows,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Activate Product =========================================
// desc Activate Product
// @route post /api/admin/activate_product/:id
// @access private
const activateProduct = async (req, res) => {
  //  activate product
  try {
    const { id } = req.body;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 400,
        message: "Product not found",
      });
    }

    const activatedProduct = await pool.query(
      "UPDATE products SET product_activated = true WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      status: 200,
      message: "Product activated successfully",
      activatedProduct: activatedProduct.rows[0],
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Deactivate Product =========================================
// desc Activate Product
// @route post /api/admin/activate_product/:id
// @access private
const deactivateProduct = async (req, res) => {
  //  deactivate product
  try {
    const { id } = req.body;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 400,
        message: "Product not found",
      });
    }

    const activatedProduct = await pool.query(
      "UPDATE products SET product_activated = false WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      status: 200,
      message: "Product deactivated successfully",
      activatedProduct: activatedProduct.rows[0],
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Delete Product =========================================
// desc Activate Product
// @route post /api/admin/activate_product/:id
// @access private
const deleteProduct = async (req, res) => {
  //  delete product
  try {
    const { id } = req.body;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 400,
        message: "Product not found",
      });
    }

    const deletedProduct = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      status: 200,
      message: "Product deleted successfully",
      deletedProduct: deletedProduct.rows[0],
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

// TODO: =========================================  DashBoard Stats =========================================
// desc Dashboard stats
// @route post /api/admin/dashboard_info
// @access private
const dashBoardInfo = async (req, res) => {
  //  get dashboard stats
  try {
    const totalAdmins = await pool.query("SELECT COUNT(*) FROM admin");
    const totalSellers = await pool.query("SELECT COUNT(*) FROM sellers");
    const totalShoppers = await pool.query("SELECT COUNT(*) FROM shoppers");
    const totalProducts = await pool.query("SELECT COUNT(*) FROM products");

    res.json({
      status: 200,
      message: "Dashboard stats",
      totalAdmins: totalAdmins.rows[0].count,
      totalSellers: totalSellers.rows[0].count,
      totalShoppers: totalShoppers.rows[0].count,
      totalProducts: totalProducts.rows[0].count,
    });
  } catch (error) {
    res.json({
      status: 400,
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
  registerAdmin,
  loginUser,
  activateProduct,
  getAllShoppers,
  getAllSellers,
  getAllProducts,
  deactivateProduct,
  deleteProduct,
  dashBoardInfo,
};
