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
const uploadRouter = require("./src/routes/uploadRouter");

require("dotenv").config();


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://172.16.1.76:5173", "http://172.16.1.76:5174", "http://0.0.0.0:5173", "http://0.0.0.0:5174"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create favorites table if it does not exist
const createFavoritesTable = `
  CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_movie (user_id, movie_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

db.query(createFavoritesTable, (err) => {
  if (err) {
    console.error('Failed to initialize favorites table:', err);
  } else {
    //console.log('Favorites table ready');
    db.query("SHOW COLUMNS FROM favorites LIKE 'created_at'", (columnErr, columns) => {
      if (columnErr) {
        console.error('Unable to check favorites schema:', columnErr);
        return;
      }

      if (!columns || columns.length === 0) {
        db.query(
          'ALTER TABLE favorites ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
          (alterErr) => {
            if (alterErr) {
              console.error('Failed to add created_at to favorites table:', alterErr);
            } else {
              console.log('Added created_at column to favorites table');
            }
          }
        );
      }
    });
  }
});

// routes
app.use("/api/users", userRouter);
app.use("/api/users", favoriteRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genre", genreRouter);
app.use("/api/countrie", countrieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/upload", uploadRouter);

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