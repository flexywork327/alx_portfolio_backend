const express = require("express");
const router = express.Router();
const {
  registerShopper,
  loginShopper,
  getShopper,
  changePassword,
  activateShopper,
} = require("../Controllers/shoppersControllers");
const { protect } = require("../Middlewares/adminAuthMiddleware");

router.get("/me/:id", protect, getShopper);

router.post("/login", loginShopper);
router.post("/register", registerShopper);
router.post("/activate_user", activateShopper);
router.post("/change_password/:id", protect, changePassword);

module.exports = router;
