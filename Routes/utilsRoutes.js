const express = require("express");
const router = express.Router();
const {
  getIndustries,
  getProduct_category,
  postIndustries,
  postProduct_category,
} = require("../Controllers/utilsControllers");

router.get("/get_industries", getIndustries);
router.get("/product_category", getProduct_category);

router.post("/post_industries", postIndustries);
router.post("/post_product_category", postProduct_category);

module.exports = router;
