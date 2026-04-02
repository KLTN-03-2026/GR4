const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const db = require("./src/db");

const userRouter = require("./src/routes/userRouter");
const favoriteRouter = require("./src/routes/favoriteRouter");
const movieRouter = require("./src/routes/movieRouter");
const genreRouter = require("./src/routes/genreRouter");
const countrieRouter = require("./src/routes/countrieRouter");
const reviewRouter = require("./src/routes/reviewRouter");
const commentRouter = require("./src/routes/commentRouter");
const uploadRouter = require("./src/routes/uploadRouter");
const vipRouter = require("./src/routes/vipRouter");
const historyRouter = require("./src/routes/historyRouter");
const notificationRouter = require("./src/routes/notificationRouter");   
const statisticsRouter = require("./src/routes/statisticsRouter");

require("dotenv").config();


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://172.16.1.76:5173", "http://172.16.1.76:5174", "http://0.0.0.0:5173", "http://0.0.0.0:5174"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/hls', express.static(path.join(__dirname, 'uploads/encoded')));
app.use('/encoded', express.static(path.join(__dirname, 'uploads/encoded')));  // Fallback para kompatibilidad
app.use("/api/users", userRouter);
app.use("/api/users", favoriteRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genre", genreRouter);
app.use("/api/countrie", countrieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/comments", commentRouter);
app.use("/api/ratings", require("./src/routes/ratingRouter"));
app.use("/api/upload", uploadRouter);
app.use("/api/vip", vipRouter);
app.use("/api/history",historyRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin/statistics", statisticsRouter);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: "Kích thước tệp quá lớn. Tối đa 10MB." });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});