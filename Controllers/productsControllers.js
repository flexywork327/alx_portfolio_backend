const pool = require("../Config/db");
const cloudinary = require("../Utils/cloudinary");

//TODO: ======================================================== Get All Product ========================================================

// desc Get Product Details
// @route post /get_product_detail
// @access public
const get_all_Products = async (req, res) => {
  try {
    //  get the product from the database
    const product = await pool.query("SELECT * FROM products");

    res.json({
      status: 200,
      message: "Products retrieved successfully",
      product: product.rows,
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

//TODO: ======================================================== Get All Active Product ========================================================

// desc Get Product Details
// @route post /get_product_detail
// @access public
const activeProduct = async (req, res) => {
  try {
    //  get the product from the database
    const product = await pool.query(
      "SELECT * FROM products WHERE product_activated = true"
    );

    res.json({
      status: 200,
      message: "Active Products retrieved successfully",
      product: product.rows,
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

//TODO: ======================================================== Get All Inactive Product ========================================================

// desc Get Product Details
// @route post /get_product_detail
// @access public
const inactiveProduct = async (req, res) => {
  try {
    //  get the product from the database
    const product = await pool.query(
      "SELECT * FROM products WHERE product_activated = false"
    );

    res.json({
      status: 200,
      message: "Inactive Products retrieved successfully",
      product: product.rows,
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

//TODO: ======================================================== Get Product Details ========================================================

// desc Get Product Details
// @route post /get_product_detail
// @access public
const get_Product_Details = async (req, res) => {
  const { post_id } = req.body;
  try {
    //  get the product from the database
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      post_id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 404,
        message: "Product not found",
      });
    } else if (product.rows.length > 0) {
      res.json({
        status: 200,
        message: "Product retrieved successfully",
        product: product.rows[0],
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

//TODO: =================================================================== List Product Category ===================================================================

//GET /list_product_category
//@desc  List Product Category
//@access public
const list_Product_Category = async (req, res) => {
  // find PRODUCT CATEGORY from the database
  try {
    const product_category = await pool.query("SELECT * FROM product_category");
    res.json({
      status: 200,
      message: "Product Category retrieved successfully",
      product_category: product_category.rows,
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ======================================================== Post Product ========================================================

// desc Post Product
// @route post /post_product
// @access public
const post_Product = async (req, res) => {
  const {
    product_name,
    product_category,
    product_description,
    product_price,
    product_quantity,
    product_section,
  } = req.body;
  const files = req.file;

  try {
    // Upload image to cloudinary
    console.log(files);
    const result = await cloudinary.uploader.upload(files.path, {
      folder: "Justlink",
    });

    //  get the product from the database
    const product = await pool.query(
      "INSERT INTO products (product_name, product_category, product_description, product_price, product_image, product_quantity, product_section,seller_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        product_name,
        product_category,
        product_description,
        product_price,
        result.secure_url,
        product_quantity,
        product_section,
        req.user.id,
      ]
    );

    res.json({
      status: 200,
      message: "Product posted successfully",
      product: product.rows[0],
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ======================================================== Edit Product ========================================================

// desc Post Product
// @route post /post_product
// @access public
const editProduct = async (req, res) => {
  // Edit Product
  const {
    product_name,
    product_category,
    product_description,
    product_price,
    product_quantity,
    product_section,
    product_position,
    product_id,
  } = req.body;
  const files = req.file;

  try {
    // Upload image to cloudinary
    console.log(files);
    const result = await cloudinary.uploader.upload(files.path, {
      folder: "Justlink",
    });
    //  get the product from the database
    const product = await pool.query(
      "UPDATE products SET product_name = $1, product_category = $2, product_description = $3, product_price = $4, product_image = $5, product_quantity = $6, product_section = $7, product_position = $8 WHERE id = $9 RETURNING *",
      [
        product_name,
        product_category,
        product_description,
        product_price,
        (product_image = result.secure_url),
        product_quantity,
        product_section,
        product_position,
        product_id,
      ]
    );

    res.json({
      status: 200,
      message: "Product edited successfully",
      product: product.rows[0],
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ======================================================== Get Product By Category ========================================================
// desc Get Product Details
// @route post /get_product_detail
// @access public
const get_Product_By_Category = async (req, res) => {
  const { product_section } = req.body;
  try {
    //  get the product from the database
    const product = await pool.query(
      "SELECT * FROM products WHERE product_section = $1 AND product_activated = true",
      [product_section]
    );

    if (product.rows.length === 0) {
      return res.json({
        status: 404,
        message: "Product not found",
      });
    } else if (product.rows.length > 0) {
      res.json({
        status: 200,
        message: "Product retrieved successfully",
        product: product.rows,
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

module.exports = {
  get_Product_Details,
  post_Product,
  list_Product_Category,
  get_all_Products,
  editProduct,
  activeProduct,
  inactiveProduct,
  get_Product_By_Category,
};
