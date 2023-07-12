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
const { sellerPrivilege } = require("../Middlewares/sellerAuthMiddleware");

// get Routes
router.get("/get_user_details", sellerPrivilege, getUser);

// post Routes
router.post("/login", loginSeller);
router.post("/register", registerSeller);
router.post("/activate_user", activateSeller);
router.post("/reset_password", resetPassword);
router.post("/update", sellerPrivilege, updateSeller);
router.post("/forgot_password", sellerPrivilege, forgotPassword);
router.post("/change_password", sellerPrivilege, changePassword);

module.exports = router;
