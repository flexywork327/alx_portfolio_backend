const express = require("express");
const router = express.Router();
const {
  getShopper,
  loginShopper,
  changePassword,
  registerShopper,
  activateShopper,
  forgotPassword,
} = require("../Controllers/shoppersControllers");
const { shopperPrivilege } = require("../Middlewares/shopperAuthMiddleware");

router.get("/me/:id", shopperPrivilege, getShopper);

router.post("/login", loginShopper);
router.post("/register", registerShopper);
router.post("/activate_user", activateShopper);
router.post("/forgot_password", shopperPrivilege, forgotPassword);
router.post("/change_password/:id", shopperPrivilege, changePassword);

module.exports = router;
