const express = require("express");
const router = express.Router();
const {
  getUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  activateUser,
  registerAdmin,
  changePassword,
} = require("../Controllers/adminControllers");
const { protect } = require("../Middlewares/adminAuthMiddleware");

router.get("/users", getAllUsers);
router.get("/me/:id", protect, getUser);

router.post("/login", loginUser);
router.post("/register", registerAdmin);
router.post("/activate_user", activateUser);
router.post("/update/:id", protect, updateUser);
router.post("/delete_user/:id", protect, deleteUser);
router.post("/change_password/:id", protect, changePassword);

module.exports = router;
