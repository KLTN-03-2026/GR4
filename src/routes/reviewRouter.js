const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { verifyToken,isAdmin } = require("../middlewares/usersMiddleware");

// Tạo review
router.post("/movie/:movie_id", verifyToken, reviewController.createReview);

// Lấy review theo movie
router.get("/movie/:movie_id", reviewController.getReviewsByMovie);

// Sửa review
router.put("/:id", verifyToken,isAdmin, reviewController.updateReview);

// Xoá review
router.delete("/:id", verifyToken,isAdmin, reviewController.deleteReview);

module.exports = router;