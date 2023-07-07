const express = require("express");
const router = express.Router();
const upload = require("../Utils/multer");
const {
  addToCart,
  editProduct,
  post_Product,
  activeProduct,
  search_Product,
  removeFromCart,
  inactiveProduct,
  get_all_Products,
  getUserCartItems,
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
router.get("/get_user_cart_item", protect, getUserCartItems);

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

router.post("/search_product", search_Product);
router.post("/add_to_cart", protect, addToCart);
router.post("/remove_from_cart", protect, removeFromCart);
router.post("/get_product_detail", get_Product_Details);
router.post("/get_product_by_category", get_Product_By_Category);

module.exports = router;
