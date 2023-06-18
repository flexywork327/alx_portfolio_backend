const express = require("express");
const router = express.Router();
const {
  getIndustries,
  getProduct_category,
  postIndustries,
  postProduct_category,
} = require("../Controllers/utilsControllers");
const { adminPrivilege } = require("../Middlewares/adminAuthMiddleware");

// Get routes
router.get("/get_industries", getIndustries);
router.get("/product_category", getProduct_category);

// Post routes
router.post("/post_industries", adminPrivilege, postIndustries);
router.post("/post_product_category", adminPrivilege, postProduct_category);

module.exports = router;
