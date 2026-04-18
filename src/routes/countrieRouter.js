const express = require("express");
const countrieRouter = express.Router();

const countrieController = require("../controllers/countrieController");
const { verifyToken,isAdmin } = require("../middlewares/usersMiddleware");



/* ===== ADMIN ===== */
countrieRouter.get("/",verifyToken, isAdmin, countrieController.getAllCountries);
countrieRouter.post("/", verifyToken, isAdmin, countrieController.createCountry);
countrieRouter.put("/:id", verifyToken, isAdmin, countrieController.updateCountry);
countrieRouter.delete("/:id", verifyToken, isAdmin, countrieController.deleteCountry);

/* ===== PUBLIC ===== */
countrieRouter.get("/public", countrieController.getPublicCountries);
countrieRouter.get("/:id", countrieController.getCountryById);

module.exports = countrieRouter;