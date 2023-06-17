const express = require("express");
const router = express.Router();
const {
  getIndustries,
  getproduct_category,
  postIndustries,
  postproduct_category,
} = require("../Controllers/utilsControllers");

router.get("/industries", getIndustries);
router.get("/product_category", getproduct_category);

router.post("/industries", postIndustries);
router.post("/product_category", postproduct_category);

module.exports = router;
