const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieController");
const { verifyToken, isAdmin } = require("../middlewares/usersMiddleware");

// ================= PUBLIC (NO AUTH REQUIRED) =================

// Get all public movies
router.get("/public", movieController.getPublicMovies);
router.get("/years", movieController.getMovieYears);

// Get public movies by genre
router.get("/genre/:genre_id", movieController.getMoviesByGenre);

// Get public movies by country
router.get("/country/:country_id", movieController.getMoviesByCountry);

// Search movies
router.get("/search", movieController.searchMovies);

// Get movie detail
router.get("/public/filter", movieController.filterMovies);
router.get("/public", movieController.getPublicMovies);
router.get("/:id", movieController.getMovieById);

// ================= ADMIN (PROTECTED) =================

// Get all movies (admin only)
router.get("/", verifyToken, isAdmin, movieController.getAllMovies);

// Create movie
router.post("/", verifyToken, isAdmin, movieController.createMovie);

// Update movie
router.put("/:id", verifyToken, isAdmin, movieController.updateMovie);

// Delete movie
router.delete("/:id", verifyToken, isAdmin, movieController.deleteMovie);

module.exports = router;