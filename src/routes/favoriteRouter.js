const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const { verifyToken } = require("../middlewares/usersMiddleware");

router.get("/me/favorites", verifyToken, favoriteController.getFavorites);
router.post("/me/favorites", verifyToken, favoriteController.addFavorite);
router.delete("/me/favorites/:movie_id", verifyToken, favoriteController.removeFavorite);

module.exports = router;
