const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const { verifyToken } = require("../middlewares/usersMiddleware");

// All history routes are protected
router.use(verifyToken);

// GET /api/history/me - Get user's watch history
router.get("/me", historyController.getHistoryMe);

// POST /api/history - Add/Update watch history
router.post("/", historyController.addToHistory);

// DELETE /api/history/:id - REMOVE SINGLE HISTORY
router.delete("/:movie_id", historyController.deleteHistoryItem);

// DELETE /api/history - CLEAR ALL
router.delete("/", historyController.clearHistory);

module.exports = router;
