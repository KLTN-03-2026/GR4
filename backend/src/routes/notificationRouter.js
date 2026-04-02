const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { verifyToken, isAdmin } = require("../middlewares/usersMiddleware");

// User routes - protected with verifyToken
router.get("/", verifyToken, notificationController.getUserNotifications);
router.get("/unread-count", verifyToken, notificationController.getUnreadCount);
router.put("/read-all", verifyToken, notificationController.markAllAsRead);
router.put("/:id/read", verifyToken, notificationController.markAsRead);
router.delete("/read", verifyToken, notificationController.deleteAllRead);
router.delete("/:id", verifyToken, notificationController.deleteNotification);

// Admin route to create notification
router.post("/", verifyToken, isAdmin, notificationController.createNotification);

module.exports = router;
