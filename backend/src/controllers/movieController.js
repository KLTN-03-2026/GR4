const db = require("../db");


// ================= ADMIN: GET ALL MOVIES =================
exports.getAllMovies = (req, res) => {

  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Chỉ admin mới có quyền xem"
    });
  }

  const sql = `
    SELECT 
      m.id,
      m.title,
      m.description,
      m.release_date,
      m.movie_url,
      m.trailer_url,
      m.avatar_url,
      m.background_url,
      m.country_id,
      c.name AS country,
      GROUP_CONCAT(g.id) AS genre_ids,
      GROUP_CONCAT(g.name) AS genres,
      m.required_vip_level,
      m.created_at
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    GROUP BY m.id
    ORDER BY m.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    
    // Transform genre_ids string to array of numbers
    const transformedResult = result.map(movie => ({
      ...movie,
      genre_ids: movie.genre_ids 
        ? movie.genre_ids.split(',').map(id => parseInt(id))
        : []
    }));
    
    res.json(transformedResult);
  });
};

// ================= PUBLIC: GET ALL MOVIES (NO AUTH) =================
exports.getPublicMovies = (req, res) => {

  const sql = `
    SELECT 
      m.id,
      m.title,
      m.description,
      m.release_date,
      m.avatar_url,
      m.background_url,
      m.trailer_url,
      c.name AS country,
      GROUP_CONCAT(g.name) AS genres,
      m.required_vip_level
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    GROUP BY m.id
    ORDER BY m.release_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ================= ADMIN: CREATE MOVIE =================
exports.createMovie = (req, res) => {

  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Chỉ admin mới có quyền thêm phim"
    });
  }

  const {
    title,
    description,
    release_date,
    movie_url,
    trailer_url,
    avatar_url,
    background_url,
    required_vip_level,
    country_id,
    genre_ids
  } = req.body;

  const sql = `
    INSERT INTO movies
    (title, description, release_date, movie_url, trailer_url, avatar_url, background_url, required_vip_level, country_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      release_date,
      movie_url,
      trailer_url,
      avatar_url,
      background_url,
      required_vip_level,
      country_id
    ],
    (err, result) => {

      if (err) return res.status(500).json(err);

      const movieId = result.insertId;

      if (!genre_ids || genre_ids.length === 0) {
        return res.json({
          message: "Movie created",
          id: movieId
        });
      }

      const values = genre_ids.map(g => [movieId, g]);

      db.query(
        "INSERT INTO movie_genres (movie_id, genre_id) VALUES ?",
        [values],
        (err2) => {

          if (err2) return res.status(500).json(err2);

          res.json({
            message: "Movie created successfully",
            id: movieId
          });
        }
      );
    }
  );
};

// ================= ADMIN: UPDATE MOVIE =================
exports.updateMovie = (req, res) => {

  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Chỉ admin mới có quyền sửa phim"
    });
  }

  const { id } = req.params;

  const {
    title,
    description,
    release_date,
    movie_url,
    trailer_url,
    avatar_url,
    background_url,
    required_vip_level,
    country_id,
    genre_ids
  } = req.body;

  const sql = `
    UPDATE movies
    SET
      title = ?,
      description = ?,
      release_date = ?,
      movie_url = ?,
      trailer_url = ?,
      avatar_url = ?,
      background_url = ?,
      required_vip_level = ?,
      country_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      description,
      release_date,
      movie_url,
      trailer_url,
      avatar_url,
      background_url,
      required_vip_level,
      country_id,
      id
    ],
    (err) => {

      if (err) return res.status(500).json(err);

      db.query(
        "DELETE FROM movie_genres WHERE movie_id = ?",
        [id],
        (err2) => {

          if (err2) return res.status(500).json(err2);

          if (!genre_ids || genre_ids.length === 0) {
            return res.json({ message: "Movie updated successfully" });
          }

          const values = genre_ids.map(g => [id, g]);

          db.query(
            "INSERT INTO movie_genres (movie_id, genre_id) VALUES ?",
            [values],
            (err3) => {

              if (err3) return res.status(500).json(err3);

              res.json({
                message: "Movie updated successfully"
              });
            }
          );
        }
      );
    }
  );
};

// ================= ADMIN: DELETE MOVIE =================
exports.deleteMovie = (req, res) => {

  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Chỉ admin mới có quyền xoá phim"
    });
  }

  const { id } = req.params;

  db.query(
    "DELETE FROM movie_genres WHERE movie_id = ?",
    [id],
    (err) => {

      if (err) return res.status(500).json(err);

      db.query(
        "DELETE FROM movies WHERE id = ?",
        [id],
        (err2, result) => {

          if (err2) return res.status(500).json(err2);

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Movie not found"
            });
          }

          res.json({
            message: "Movie deleted successfully"
          });
        }
      );
    }
  );
};

// ================= USER: GET MOVIE BY ID =================
exports.getMovieById = (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT
      m.id,
      m.title,
      m.description,
      m.release_date,
      m.movie_url,
      m.trailer_url,
      m.avatar_url,
      m.background_url,
      c.name AS country,
      GROUP_CONCAT(g.name) AS genres,
      COUNT(DISTINCT f.user_id) AS likes,
      m.required_vip_level
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN favorites f ON m.id = f.movie_id
    WHERE m.id = ?
    GROUP BY m.id
  `;

  db.query(sql, [id], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.json(result[0]);
  });
};

// ================= USER: SEARCH MOVIE =================
exports.searchMovies = (req, res) => {

  const keyword = req.query.keyword || "";

  const sql = `
    SELECT
      m.id,
      m.title,
      m.avatar_url,
      m.release_date,
      c.name AS country,
      GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.title COLLATE utf8mb4_unicode_ci LIKE ?
      OR m.description COLLATE utf8mb4_unicode_ci LIKE ?
      OR g.name COLLATE utf8mb4_unicode_ci LIKE ?
    GROUP BY m.id
  `;

  const searchPattern = `%${keyword}%`;
  db.query(sql, [searchPattern, searchPattern, searchPattern], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ================= USER: FILTER BY GENRE =================
exports.getMoviesByGenre = (req, res) => {

  const { genre_id } = req.params;

  const sql = `
    SELECT
      m.id,
      m.title,
      m.avatar_url,
      m.release_date
    FROM movies m
    JOIN movie_genres mg ON m.id = mg.movie_id
    WHERE mg.genre_id = ?
  `;

  db.query(sql, [genre_id], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// ================= USER: FILTER BY COUNTRY =================
exports.getMoviesByCountry = (req, res) => {

  const { country_id } = req.params;

  const sql = `
    SELECT
      id,
      title,
      avatar_url,
      release_date
    FROM movies
    WHERE country_id = ?
  `;

  db.query(sql, [country_id], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// ================= USER: FILTER MOVIES (MAIN API) =================
exports.filterMovies = (req, res) => {
  const { genre, country, year, sort } = req.query;

  let sql = `
    SELECT 
      m.id,
      m.title,
      m.avatar_url,
      m.background_url,
      m.release_date,
      c.name AS country,
      GROUP_CONCAT(g.name) AS genres,
      m.required_vip_level
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE 1=1
  `;

  let params = [];

  // ===== FILTER GENRE (FIX CHUẨN) =====
  if (genre) {
    sql += `
      AND EXISTS (
        SELECT 1
        FROM movie_genres mg2
        JOIN genres g2 ON mg2.genre_id = g2.id
        WHERE mg2.movie_id = m.id
        AND LOWER(g2.name) = LOWER(?)
      )
    `;
    params.push(genre);
  }

  // ===== FILTER COUNTRY =====
  if (country) {
    sql += " AND c.name = ?";
    params.push(country);
  }

  // ===== FILTER YEAR =====
  if (year) {
    if (year === "Trước 2022") {
      sql += " AND YEAR(m.release_date) < ?";
      params.push(2022);
    } else {
      sql += " AND YEAR(m.release_date) = ?";
      params.push(Number(year));
    }
  }

  sql += " GROUP BY m.id";

  // ===== SORT =====
  if (sort === "new") {
    sql += " ORDER BY m.release_date DESC";
  } else if (sort === "old") {
    sql += " ORDER BY m.release_date ASC";
  } else if (sort === "rating") {
    sql += " ORDER BY m.rating DESC";
  } else if (sort === "views") {
    sql += " ORDER BY m.views DESC";
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
};