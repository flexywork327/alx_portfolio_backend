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
    if (industries.rows.length === 0) {
      return res.json({
        status: 404,
        message: "No industries found",
      });
    } else if (industries.rows.length > 0) {
      res.json({
        status: 200,
        message: "Industries retrieved successfully",
        industries: industries.rows[0],
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};
// TODO: ========================================= Get Industries List =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const getproduct_category = async (req, res) => {
  try {
    //  get the industries from the database
    const industries = await pool.query(
      "SELECT *  FROM industries ORDER BY industry_name ASC"
    );
    if (industries.rows.length === 0) {
      return res.json({
        status: 404,
        message: "No industries found",
      });
    } else if (industries.rows.length > 0) {
      res.json({
        status: 200,
        message: "Industries retrieved successfully",
        industries: industries.rows[0],
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};
// TODO: ========================================= Get Industries List =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const postIndustries = async (req, res) => {
  try {
    //  get the industries from the database
    const industries = await pool.query(
      "SELECT *  FROM industries ORDER BY industry_name ASC"
    );
    if (industries.rows.length === 0) {
      return res.json({
        status: 404,
        message: "No industries found",
      });
    } else if (industries.rows.length > 0) {
      res.json({
        status: 200,
        message: "Industries retrieved successfully",
        industries: industries.rows[0],
      });
    }
  } catch (error) {
    res.json({
      message: `${error}`,
    });
  }
};
// TODO: ========================================= Get Industries List =========================================
// desc Get Industries List
// @route get /api/user/industries
// @access public
const postproduct_category = async (req, res) => {
  try {
    //  get the industries from the database
    const industries = await pool.query(
      "SELECT *  FROM industries ORDER BY industry_name ASC"
    );
    if (industries.rows.length === 0) {
      return res.json({
        status: 404,
        message: "No industries found",
      });
    } else if (industries.rows.length > 0) {
      res.json({
        status: 200,
        message: "Industries retrieved successfully",
        industries: industries.rows[0],
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
  getproduct_category,
  postIndustries,
  postproduct_category,
};
