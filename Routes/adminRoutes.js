const express = require("express");
const router = express.Router();
const {
  getUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllSellers,
  getAllShoppers,
  activateUser,
  registerAdmin,
  activateProduct,
  getAllProducts,
  deactivateProduct,
  deleteProduct,
  dashBoardInfo,
} = require("../Controllers/adminControllers");
// const { protect } = require("../Middlewares/adminAuthMiddleware");

// router.get("/me/:id", protect, getUser);
router.get("/get_all_seller", getAllSellers);
router.get("/dashboard_info", dashBoardInfo);
router.get("/get_all_shoppers", getAllShoppers);
router.get("/get_all_products", getAllProducts);

router.post("/login", loginUser);
router.post("/update/:id", updateUser);
router.post("/register", registerAdmin);
router.post("/activate_user", activateUser);
router.post("/delete_user/:id", deleteUser);
router.post("/delete_product", deleteProduct);
router.post("/activate_product", activateProduct);
router.post("/deactivate_product", deactivateProduct);

// TODO:

module.exports = router;
