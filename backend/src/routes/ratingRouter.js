const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { verifyToken } = require("../middlewares/usersMiddleware");

router.post("/", verifyToken, ratingController.createOrUpdateRating);
router.get("/:movieId", ratingController.getRatingsByMovie);
router.get("/user/:movieId", verifyToken, ratingController.getUserRatingByMovie);

module.exports = router;
