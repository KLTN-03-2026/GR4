const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { verifyToken, isAdmin } = require("../middlewares/usersMiddleware");

router.post("/", verifyToken, commentController.createComment);
router.get("/", verifyToken, isAdmin, commentController.getAllComments);
router.get("/:movieId", commentController.getCommentsByMovie);
router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;
