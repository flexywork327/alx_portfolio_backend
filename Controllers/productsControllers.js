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

// TODO: ======================================================== Search Product ========================================================
// desc Get Product Details
// @route post /get_product_detail
// @access public
const search_Product = async (req, res) => {
  const { product_name } = req.body;
  try {
    //  get the product from the database
    const product = await pool.query(
      "SELECT * FROM products WHERE product_name LIKE $1 AND product_activated = true",
      ["%" + product_name + "%"]
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

// TODO: ======================================================== Add To Cart ========================================================
// desc Get Product Details
// @route post /get_product_detail
// @access public
const addToCart = async (req, res) => {
  const { product_id, cart_quantity } = req.body;
  try {
    //  get the product from the database
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      product_id,
    ]);

    if (product.rows.length === 0) {
      return res.json({
        status: 404,
        message: "Product not found",
      });
    } else if (product.rows.length > 0) {
      const {
        product_name,
        product_category,
        product_description,
        product_price,
        product_quantity,
        product_image,
        product_section,
        product_activated,
        seller_id,
      } = product.rows[0];

      const add_Product = await pool.query(
        "INSERT INTO cart (product_name, product_category, product_description, product_price, product_quantity,product_image, product_section,seller_id,product_activated,cart_quantity,shopper_id,total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        [
          product_name,
          product_category,
          product_description,
          product_price,
          product_quantity,
          product_image,
          product_section,
          seller_id,
          product_activated,
          cart_quantity,
          req.user.id,
          (total_cost = product_price * cart_quantity),
        ]
      );

      res.json({
        status: 200,
        message: "Product added to cart successfully",
        product: add_Product.rows[0],
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ======================================================== Get User Cart Items ========================================================
// desc Get Product Details
// @route post /get_product_detail
// @access public
const getUserCartItems = async (req, res) => {
  try {
    //  get the product from the database
    const product = await pool.query(
      "SELECT * FROM cart WHERE shopper_id = $1",
      [req.user.id]
    );

    if (product.rows.length === 0) {
      return res.json({
        status: 404,
        message: "Product not found",
      });
    } else if (product.rows.length > 0) {
      // loop through all the products in the cart and add the total cost as cart_total
      let cart_total = 0;
      product.rows.forEach((item) => {
        // convert the total_cost to a number
        item.total_cost = Number(item.total_cost);

        // add the total_cost to the cart_total
        cart_total += item.total_cost;
      });

      res.json({
        status: 200,
        message: "Product retrieved successfully",
        product: product.rows,
        cart_total,
        count: product.rows.length,
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ======================================================== Remove From Cart ========================================================
// desc Get Product Details
// @route post /get_product_detail
// @access public
const removeFromCart = async (req, res) => {
  const { cart_id } = req.body;
  try {
    //  get the product from the database
    const product = await pool.query("DELETE FROM cart WHERE cart_id = $1", [
      cart_id,
    ]);

    res.json({
      status: 200,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

module.exports = {
  addToCart,
  editProduct,
  post_Product,
  activeProduct,
  removeFromCart,
  search_Product,
  inactiveProduct,
  getUserCartItems,
  get_all_Products,
  get_Product_Details,
  list_Product_Category,
  get_Product_By_Category,
};
