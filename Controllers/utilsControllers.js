const pool = require("../Config/db");

// TODO: ========================================= Get Industries List =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const getIndustries = async (req, res) => {
  try {
    //  get the industries from the database
    const industries = await pool.query(
      "SELECT *  FROM industries ORDER BY industry_name ASC"
    );

    res.json({
      status: 200,
      message: "Industries retrieved successfully",
      industries: industries.rows,
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Get Products Category List =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const getProduct_category = async (req, res) => {
  try {
    //  get the industries from the database
    const product_categories = await pool.query(
      "SELECT *  FROM product_categories ORDER BY product_name ASC"
    );
    if (product_categories.rows.length === 0) {
      return res.json({
        status: 404,
        message: "No product_categories found",
      });
    } else if (product_categories.rows.length > 0) {
      res.json({
        status: 200,
        message: "product_categories retrieved successfully",
        product_categories: product_categories.rows,
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Post Industries =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const postIndustries = async (req, res) => {
  // post industries to the database
  try {
    const { industry_name } = req.body;
    const newIndustry = await pool.query(
      "INSERT INTO industries (industry_name) VALUES($1) RETURNING *",
      [industry_name]
    );
    res.json({
      status: 200,
      message: "Industry added successfully",
      industry: newIndustry.rows[0],
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Post Product Categories =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const postProduct_category = async (req, res) => {
  //  post product_categories to the database
  try {
    const { product_category_name } = req.body;
    const newProduct_category = await pool.query(
      "INSERT INTO product_categories (product_category_name) VALUES($1) RETURNING *",
      [product_category_name]
    );
    res.json({
      status: 200,
      message: "Product category added successfully",
      product_category: newProduct_category.rows[0],
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Post Product Sections =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const postProduct_sections = async (req, res) => {
  //  post product_categories to the database
  try {
    const { product_section_name } = req.body;
    const newProduct_section = await pool.query(
      "INSERT INTO product_sections (product_section_name) VALUES($1) RETURNING *",
      [product_section_name]
    );
    res.json({
      status: 200,
      message: "Product section added successfully",
      product_section: newProduct_section.rows[0],
    });
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

// TODO: ========================================= Get Product Sections List =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const getProduct_sections = async (req, res) => {
  try {
    //  get the industries from the database
    const product_sections = await pool.query(
      "SELECT *  FROM product_sections ORDER BY product_section_name ASC"
    );
    if (product_sections.rows.length === 0) {
      return res.json({
        status: 404,
        message: "No product_sections found",
      });
    } else if (product_sections.rows.length > 0) {
      res.json({
        status: 200,
        message: "product_sections retrieved successfully",
        product_sections: product_sections.rows,
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};

module.exports = {
  getIndustries,
  getProduct_category,
  postIndustries,
  postProduct_category,
  postProduct_sections,
  getProduct_sections,
};
