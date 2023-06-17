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
  changePassword,
  getAllProducts,
} = require("../Controllers/adminControllers");
// const { protect } = require("../Middlewares/adminAuthMiddleware");

// router.get("/me/:id", protect, getUser);
router.get("/get_all_seller", getAllSellers);
router.get("/get_all_shoppers", getAllShoppers);
router.get("/get_all_products", getAllProducts);

router.post("/login", loginUser);
router.post("/register", registerAdmin);
router.post("/activate_user", activateUser);
router.post("/update/:id", updateUser);
router.post("/delete_user/:id", deleteUser);
router.post("/change_password/:id", changePassword);

module.exports = router;
