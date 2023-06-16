const express = require("express");
const router = express.Router();
const {
  registerSeller,
  loginUser,
  getUser,
  updateUser,
  changePassword,
  getAllUsers,
  deleteUser,
  activateUser,
} = require("../Controllers/adminControllers");
const { protect } = require("../Middlewares/adminAuthMiddleware");
const { superPrivilege } = require("../Middlewares/superPrivilegeMiddleware"); // privilege middleware is used to protect routes from unauthorized access

router.get("/me/:id", protect, getUser);
router.get("/users", getAllUsers);
// router.get("/users", protect, getAllUsers);

router.post("/activate_user", activateUser);
router.post("/register", registerSeller);
router.post("/login", loginUser);
router.post("/update/:id", protect, updateUser);
router.post("/delete_user/:id", protect, deleteUser);
// router.post("/delete_user/:id", superPrivilege, deleteUser);
router.post("/change_password/:id", protect, changePassword);

module.exports = router;
