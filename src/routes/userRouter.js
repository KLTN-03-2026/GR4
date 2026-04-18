const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { verifyToken, isAdmin } = require("../middlewares/usersMiddleware");

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);

// User profile
router.get("/me", verifyToken, userController.getProfile);

// Admin quản lý user
router.get("/", verifyToken, isAdmin, userController.getAllUsers);
router.put("/update/:id", verifyToken, isAdmin, userController.updateUserforAdmin);
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);
router.get("/:id", verifyToken, isAdmin, userController.getUserById);

// User actions
router.put("/me/update", verifyToken, userController.updateUserforUser);
router.put("/me/change-password", verifyToken, userController.changePassword);

module.exports = router;