const pool = require("../Config/db");

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
    product_image,
    product_quantity,
    product_location,
    product_position, //TODO: add product_position as a parameter to put the item in the right position on the site either on the New or Top Ranking section
  } = req.body;

  try {
    //  get the product from the database
    const product = await pool.query(
      "INSERT INTO products (product_name, product_category, product_description, product_price, product_image, product_quantity, product_location,product_position,seller_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        product_name,
        product_category,
        product_description,
        product_price,
        product_image,
        product_quantity,
        product_location,
        product_position,
        (seller_id = req.user.id),
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

module.exports = {
  get_Product_Details,
  post_Product,
  list_Product_Category,
  get_all_Products,
};
