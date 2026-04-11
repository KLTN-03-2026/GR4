const express = require("express");
const genreRouter = express.Router();

const genreController = require("../controllers/genreController");
const { verifyToken,isAdmin } = require("../middlewares/usersMiddleware");


/* ===== PUBLIC ===== */
genreRouter.get("/public", genreController.getPublicGenres);
//genreRouter.get("/:id", genreController.getGenreById);

/* ===== ADMIN ===== */
genreRouter.get("/", verifyToken,isAdmin,genreController.getAllGenres);
genreRouter.post("/", verifyToken, isAdmin, genreController.createGenre);
genreRouter.put("/:id", verifyToken, isAdmin, genreController.updateGenre);
genreRouter.delete("/:id", verifyToken, isAdmin, genreController.deleteGenre);

module.exports = genreRouter;