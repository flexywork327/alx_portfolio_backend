const express = require("express");
const router = express.Router();
const {
  getUser,
  loginSeller,
  resetPassword,
  updateSeller,
  activateSeller,
  changePassword,
  registerSeller,
  forgotPassword,
} = require("../Controllers/sellersControllers");
const { protect } = require("../Middlewares/sellerAuthMiddleware");

// get Routes
router.get("/me/:id", protect, getUser);

// post Routes
router.post("/login", loginSeller);
router.post("/register", registerSeller);
router.post("/activate_user", activateSeller);
router.post("/reset_password", resetPassword);
router.post("/update/:id", protect, updateSeller);
router.post("/forgot_password", protect, forgotPassword);
router.post("/change_password/:id", protect, changePassword);

module.exports = router;
