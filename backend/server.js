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

require("dotenv").config();


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://172.16.1.76:5173", "http://172.16.1.76:5174", "http://0.0.0.0:5173", "http://0.0.0.0:5174"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const createReviewsTable = `
  CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    comment TEXT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    content TEXT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const createRatingsTable = `
  CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    value TINYINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_movie (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

db.query(createReviewsTable, (err) => {
  if (err) {
    console.error('Failed to initialize reviews table:', err);
  }
});

db.query(createCommentsTable, (err) => {
  if (err) {
    console.error('Failed to initialize comments table:', err);
  }
});

db.query(createRatingsTable, (err) => {
  if (err) {
    console.error('Failed to initialize ratings table:', err);
  }
});

const ensureRatingsSchema = () => {
  db.query("SHOW COLUMNS FROM ratings LIKE 'value'", (err, result) => {
    if (err) return console.error('Failed to inspect ratings table:', err);
    if (result.length === 0) {
      db.query("SHOW COLUMNS FROM ratings LIKE 'rating'", (ratingErr, ratingResult) => {
        if (ratingErr) return console.error('Failed to inspect ratings rating column:', ratingErr);
        if (ratingResult.length > 0) {
          db.query("ALTER TABLE ratings CHANGE COLUMN rating value TINYINT UNSIGNED NULL", (changeErr) => {
            if (changeErr) console.error('Failed to rename ratings.rating to value:', changeErr);
          });
        }
      });
    }
  });

  db.query("SHOW COLUMNS FROM ratings LIKE 'updated_at'", (err, result) => {
    if (err) return console.error('Failed to inspect ratings table for updated_at:', err);
    if (result.length === 0) {
      db.query("ALTER TABLE ratings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER value", (alterErr) => {
        if (alterErr) console.error('Failed to add updated_at to ratings:', alterErr);
      });
    }
  });

  db.query("SHOW COLUMNS FROM ratings LIKE 'id'", (err, result) => {
    if (err) return console.error('Failed to inspect ratings table for id:', err);
    if (result.length === 0) {
      db.query("ALTER TABLE ratings DROP PRIMARY KEY", (dropErr) => {
        if (dropErr) {
          console.error('Failed to drop existing primary key on ratings:', dropErr);
          return;
        }
        db.query("ALTER TABLE ratings ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST", (addErr) => {
          if (addErr) console.error('Failed to add id to ratings:', addErr);
        });
      });
    }
  });

  db.query("SHOW INDEX FROM ratings WHERE Key_name = 'unique_user_movie'", (err, result) => {
    if (err) return console.error('Failed to inspect ratings indexes:', err);
    if (result.length === 0) {
      db.query("ALTER TABLE ratings ADD UNIQUE KEY unique_user_movie (user_id, movie_id)", (idxErr) => {
        if (idxErr) console.error('Failed to add unique index to ratings:', idxErr);
      });
    }
  });
};

ensureRatingsSchema();

// routes
app.use("/api/users", userRouter);
app.use("/api/users", favoriteRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genre", genreRouter);
app.use("/api/countrie", countrieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/comments", commentRouter);
app.use("/api/ratings", require("./src/routes/ratingRouter"));
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