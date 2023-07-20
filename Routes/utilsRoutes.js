const express = require("express");
const router = express.Router();
const {
  getIndustries,
  getProduct_category,
  postIndustries,
  postProduct_category,
  postProduct_sections,
  getProduct_sections,
} = require("../controllers/utilsControllers");
const { adminPrivilege } = require("../middlewares/adminAuthMiddleware");

// Get routes
router.get("/get_industries", getIndustries);
router.get("/get_product_sections", getProduct_sections);
router.get("/get_product_category", getProduct_category);

// Post routes
router.post("/post_industries", adminPrivilege, postIndustries);
router.post("/post_product_sections", adminPrivilege, postProduct_sections);
router.post("/post_product_category", adminPrivilege, postProduct_category);

module.exports = router;
