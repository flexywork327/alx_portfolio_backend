const express = require("express");
const router = express.Router();
const {
  get_Product_Details,
  list_Product_Category,
  post_Product,
} = require("../Controllers/productsControllers");

router.get("/product_category", list_Product_Category);

router.post("/post_product", post_Product);
router.post("/get_product_detail", get_Product_Details);

module.exports = router;
