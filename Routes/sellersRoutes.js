const express = require("express");
const router = express.Router();
const {
  getUser,
  loginSeller,
  updateSeller,
  activateSeller,
  changePassword,
  registerSeller,
} = require("../Controllers/sellersControllers");
const { protect } = require("../Middlewares/sellerAuthMiddleware");

router.get("/me/:id", protect, getUser);

router.post("/login", loginSeller);
router.post("/register", registerSeller);
router.post("/activate_user", activateSeller);
router.post("/update/:id", protect, updateSeller);
router.post("/change_password/:id", protect, changePassword);

module.exports = router;
