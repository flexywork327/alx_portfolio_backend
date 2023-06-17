const express = require("express");
const router = express.Router();
const {
  get_Product_Details,
  list_Product_Category,
  post_Product,
  get_all_Products,
} = require("../Controllers/productsControllers");
const { protect } = require("../Middlewares/sellerAuthMiddleware");

router.get("/product_category", list_Product_Category);
router.get("/get_all_products", protect, get_all_Products);

router.post("/post_product", protect, post_Product);
router.post("/get_product_detail", protect, get_Product_Details);

module.exports = router;
