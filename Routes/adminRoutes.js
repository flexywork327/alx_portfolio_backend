const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerAdmin,
  getAllSellers,
  dashBoardInfo,
  deleteProduct,
  getAllProducts,
  getAllShoppers,
  activateProduct,
  deactivateProduct,
} = require("../Controllers/adminControllers");
const { adminPrivilege } = require("../Middlewares/adminAuthMiddleware");

// get Routes
router.get("/get_all_seller", adminPrivilege, getAllSellers);
router.get("/dashboard_info", adminPrivilege, dashBoardInfo);
router.get("/get_all_shoppers", adminPrivilege, getAllShoppers);
router.get("/get_all_products", adminPrivilege, getAllProducts);

// post Routes
router.post("/login", loginUser);
router.post("/register", registerAdmin);
router.post("/delete_product", adminPrivilege, deleteProduct);
router.post("/activate_product", adminPrivilege, activateProduct);
router.post("/deactivate_product", adminPrivilege, deactivateProduct);

module.exports = router;
