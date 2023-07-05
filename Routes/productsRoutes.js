const express = require("express");
const router = express.Router();
const upload = require("../Utils/multer");
const {
  editProduct,
  post_Product,
  activeProduct,
  inactiveProduct,
  get_all_Products,
  get_Product_Details,
  list_Product_Category,
  get_Product_By_Category,
} = require("../Controllers/productsControllers");
const { protect } = require("../Middlewares/sellerAuthMiddleware");

// get Routes
router.get("/active", activeProduct);
router.get("/inactive", inactiveProduct);
router.get("/get_all_products", get_all_Products);
router.get("/product_category", list_Product_Category);

// post Routes
router.post(
  "/edit_product",
  protect,
  upload.single("product_image"),
  editProduct
);

router.post(
  "/post_product",
  protect,
  upload.single("product_image"),
  post_Product
);

router.post("/get_product_detail", get_Product_Details);
router.post("/get_product_by_category", get_Product_By_Category);

// TODO:

module.exports = router;
