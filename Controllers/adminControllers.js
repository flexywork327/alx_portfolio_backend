const bcrypt = require("bcryptjs");
JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const pool = require("../Config/db");
const cloudinary = require("../Utils/cloudinary");

//TODO: ======================================================== Register User ========================================================

// desc Register User
// @route post /admin/register
// @access public
const registerAdmin = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    // check if user already exists
    const user = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

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
// @route post /admin/login
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

    // if user exists, compare password and if not match, return error
    if (user && (await bcrypt.compare(password, user.rows[0].password))) {
      res.status(200).json({
        status: 200,
        message: "Successfully logged in",
        user: {
          id: user.rows[0].id,
          first_name: user.rows[0].first_name,
          last_name: user.rows[0].last_name,
          email: user.rows[0].email,
          role: user.rows[0].role,
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

//TODO: ======================================================== Get All Sellers ========================================================

// desc Get All Sellers
// @route get /admin/get_all_seller
// @access private (login needed)
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

// desc Get All Shoppers
// @route get /admin/get_all_shoppers
// @access private (login needed)
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

// desc Get All Products
// @route get /admin/all
// @access private (login needed)
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
// @route post /admin/activate_product
// @access private (login needed)
const activateProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      product_id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 400,
        message: "Product not found",
      });
    }

    const activatedProduct = await pool.query(
      "UPDATE products SET product_activated = true WHERE id = $1 RETURNING *",
      [product_id]
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
// desc Deactivate Product
// @route post /admin/deactivate_product
// @access private (login needed)
const deactivateProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      product_id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 400,
        message: "Product not found",
      });
    }

    const deactivatedProduct = await pool.query(
      "UPDATE products SET product_activated = false WHERE id = $1 RETURNING *",
      [product_id]
    );

    res.json({
      status: 200,
      message: "Product deactivated successfully",
      deactivatedProduct: deactivatedProduct.rows[0],
    });
  } catch (error) {
    res.json({
      status: 400,
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Delete Product =========================================
// desc Delete Product
// @route post /admin/delete_product
// @access private (login needed)
const deleteProduct = async (req, res) => {
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

    // delete image from cloudinary
    await cloudinary.uploader.destroy(product.rows[0].image_id);

    const deletedProduct = await pool.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    res.json({
      status: 200,
      message: `Product with id ${id} deleted successfully`,
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
// @route post /admin/dashboard_info
// @access private
const dashBoardInfo = async (req, res) => {
  try {
    const totalAdmins = await pool.query("SELECT COUNT(*) FROM admin");
    const totalSellers = await pool.query("SELECT COUNT(*) FROM sellers");
    const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
    // const totalShoppers = await pool.query("SELECT COUNT(*) FROM shoppers"); this is not needed for now

    res.json({
      status: 200,
      message: "Dashboard stats",
      total_Admins: totalAdmins.rows[0].count,
      total_Sellers: totalSellers.rows[0].count,
      total_Products: totalProducts.rows[0].count,
      // totalShoppers: totalShoppers.rows[0].count,
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
  loginUser,
  dashBoardInfo,
  registerAdmin,
  getAllSellers,
  deleteProduct,
  getAllShoppers,
  getAllProducts,
  activateProduct,
  deactivateProduct,
};
