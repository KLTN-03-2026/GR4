const db = require("../db");
const { parsePagination, buildPagination } = require("../utils/pagination");


// ================= ADMIN: GET ALL MOVIES =================
exports.getAllMovies = async (req, res) => {
  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Chỉ admin mới có quyền xem"
    });
  }

  const { page, limit, offset } = parsePagination(req);
  const search = req.query.search || "";
  const genreId = req.query.genreId;
  const countryId = req.query.countryId;

  try {
    // 1️⃣ Count total movies with filters
    let countSql = `
      SELECT COUNT(DISTINCT m.id) AS total 
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE 1=1
    `;
    let countParams = [];

    if (search) {
      countSql += ` AND (m.title LIKE ? OR g.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (genreId) {
      countSql += ` AND mg.genre_id = ?`;
      countParams.push(genreId);
    }
    if (countryId) {
      countSql += ` AND m.country_id = ?`;
      countParams.push(countryId);
    }

    const [countRows] = await db.promise().query(countSql, countParams);
    const total = countRows[0]?.total || 0;

    // 2️⃣ Get movies for current page with filters
    let sql = `
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
      WHERE 1=1
    `;
    let params = [];
    
    if (search) {
      sql += ` AND (m.title LIKE ? OR g.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (genreId) {
      sql += ` AND m.id IN (SELECT movie_id FROM movie_genres WHERE genre_id = ?)`;
      params.push(genreId);
    }
    if (countryId) {
      sql += ` AND m.country_id = ?`;
      params.push(countryId);
    }

    sql += ` GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [result] = await db.promise().query(sql, params);
    
    const transformedResult = result.map(movie => ({
      ...movie,
      genre_ids: movie.genre_ids
        ? movie.genre_ids.split(',').map(id => parseInt(id))
        : []
    }));

    res.json({
      data: transformedResult,
      pagination: buildPagination(page, limit, total),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ================= PUBLIC: GET ALL MOVIES (NO AUTH) =================
exports.getPublicMovies = async (req, res) => {
  const { page, limit, offset } = parsePagination(req);
  const { genre, country, sort } = req.query;

  try {
    let countSql = `
      SELECT COUNT(DISTINCT m.id) AS total 
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      LEFT JOIN countries c ON m.country_id = c.id
      WHERE 1=1
    `;
    let countParams = [];

    // Filter logic for count
    if (genre) {
      countSql += ` AND g.name = ?`;
      countParams.push(genre);
    }
    if (country) {
      countSql += ` AND c.name = ?`;
      countParams.push(country);
    }

    const [countRows] = await db.promise().query(countSql, countParams);
    const total = countRows[0]?.total || 0;

    // Main query
    let sql = `
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
        m.required_vip_level,
        (SELECT AVG(rating) FROM reviews r WHERE r.movie_id = m.id) AS rating,
        (SELECT COUNT(*) FROM movie_views mv WHERE mv.movie_id = m.id) AS views
      FROM movies m
      LEFT JOIN countries c ON m.country_id = c.id
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE 1=1
    `;
    let params = [];

    if (genre) {
      sql += ` AND m.id IN (
        SELECT mg2.movie_id FROM movie_genres mg2 
        JOIN genres g2 ON mg2.genre_id = g2.id 
        WHERE g2.name = ?
      )`;
      params.push(genre);
    }

    if (country) {
      sql += ` AND c.name = ?`;
      params.push(country);
    }

    sql += ` GROUP BY m.id`;

    // Sort mapping
    if (sort === 'new') {
      sql += ` ORDER BY m.release_date DESC`;
    } else if (sort === 'old') {
      sql += ` ORDER BY m.release_date ASC`;
    } else if (sort === 'rating') {
      sql += ` ORDER BY rating DESC`;
    } else if (sort === 'views') {
      sql += ` ORDER BY views DESC`;
    } else {
      sql += ` ORDER BY m.created_at DESC`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [result] = await db.promise().query(sql, params);
    res.json({
      data: result,
      pagination: buildPagination(page, limit, total),
    });
  } catch (err) {
    console.error("GET PUBLIC MOVIES ERROR:", err);
    res.status(500).json(err);
  }
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
      IFNULL(ROUND(AVG(rt.rating), 1), 0) AS average_rating,
      COUNT(rt.movie_id) AS review_count,
      m.required_vip_level
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN favorites f ON m.id = f.movie_id
    LEFT JOIN ratings rt ON m.id = rt.movie_id
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
exports.searchMovies = async (req, res) => {
  const keyword = req.query.keyword || "";
  const { page, limit, offset } = parsePagination(req);
  const searchPattern = `%${keyword}%`;

  try {
    const [countRows] = await db.promise().query(
      `
        SELECT COUNT(DISTINCT m.id) AS total
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE m.title COLLATE utf8mb4_unicode_ci LIKE ?
          OR m.description COLLATE utf8mb4_unicode_ci LIKE ?
          OR g.name COLLATE utf8mb4_unicode_ci LIKE ?
      `,
      [searchPattern, searchPattern, searchPattern]
    );

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
      ORDER BY m.release_date DESC
      LIMIT ? OFFSET ?
    `;

    const [result] = await db.promise().query(sql, [searchPattern, searchPattern, searchPattern, limit, offset]);

    res.json({
      data: result,
      pagination: buildPagination(page, limit, countRows[0]?.total || 0),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ================= USER: FILTER BY GENRE =================
exports.getMoviesByGenre = async (req, res) => {
  const { genre_id } = req.params;
  const { page, limit, offset } = parsePagination(req);

  try {
    const [countRows] = await db.promise().query(
      `
        SELECT COUNT(*) AS total
        FROM movie_genres mg
        WHERE mg.genre_id = ?
      `,
      [genre_id]
    );

    const sql = `
      SELECT
        m.id,
        m.title,
        m.avatar_url,
        m.release_date
      FROM movies m
      JOIN movie_genres mg ON m.id = mg.movie_id
      WHERE mg.genre_id = ?
      ORDER BY m.release_date DESC
      LIMIT ? OFFSET ?
    `;

    const [result] = await db.promise().query(sql, [genre_id, limit, offset]);

    res.json({
      data: result,
      pagination: buildPagination(page, limit, countRows[0]?.total || 0),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ================= USER: FILTER BY COUNTRY =================
exports.getMoviesByCountry = async (req, res) => {
  const { country_id } = req.params;
  const { page, limit, offset } = parsePagination(req);

  try {
    const [countRows] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM movies WHERE country_id = ?`,
      [country_id]
    );

    const sql = `
      SELECT
        id,
        title,
        avatar_url,
        release_date
      FROM movies
      WHERE country_id = ?
      ORDER BY release_date DESC
      LIMIT ? OFFSET ?
    `;

    const [result] = await db.promise().query(sql, [country_id, limit, offset]);

    res.json({
      data: result,
      pagination: buildPagination(page, limit, countRows[0]?.total || 0),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ================= USER: FILTER MOVIES (MAIN API) =================
exports.filterMovies = async (req, res) => {
  const { genre, country, year, sort } = req.query;
  const { page, limit, offset } = parsePagination(req);

  let baseSql = `
    FROM movies m
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE 1=1
  `;

  let params = [];

  // ===== FILTER GENRE =====
  if (genre) {
    baseSql += `
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
    baseSql += " AND c.name = ?";
    params.push(country);
  }

  // ===== FILTER YEAR =====
  if (year) {
    if (year === "Trước 2022") {
      baseSql += " AND YEAR(m.release_date) < ?";
      params.push(2022);
    } else {
      baseSql += " AND YEAR(m.release_date) = ?";
      params.push(Number(year));
    }
  }

  const countSql = `SELECT COUNT(DISTINCT m.id) AS total ${baseSql}`;

  let sql = `
    SELECT
      m.id,
      m.title,
      m.avatar_url,
      m.background_url,
      m.release_date,
      c.name AS country,
      GROUP_CONCAT(DISTINCT g.name) AS genres,
      m.required_vip_level,
      (SELECT IFNULL(ROUND(AVG(rating), 1), 0) FROM ratings WHERE movie_id = m.id) AS average_rating,
      (SELECT COUNT(*) FROM movie_views WHERE movie_id = m.id) AS views
    ${baseSql}
    GROUP BY m.id
  `;

  db.query(countSql, params, (countErr, countResult) => {
    if (countErr) {
      console.error("COUNT SQL ERROR:", countErr);
      return res.status(500).json(countErr);
    }

    const total = countResult[0]?.total || 0;

    let pageSql = sql;
    if (sort === "new") {
      pageSql += " ORDER BY m.release_date DESC";
    } else if (sort === "old") {
      pageSql += " ORDER BY m.release_date ASC";
    } else if (sort === "rating") {
      pageSql += " ORDER BY average_rating DESC";
    } else if (sort === "views") {
      pageSql += " ORDER BY views DESC";
    }

    pageSql += " LIMIT ? OFFSET ?";
    const pageParams = [...params, limit, offset];

    db.query(pageSql, pageParams, (err, result) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        data: result,
        pagination: buildPagination(page, limit, total)
      });
    });
  });
};

// ================= PUBLIC: GET MOVIE YEARS =================
exports.getMovieYears = async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT YEAR(release_date) as year 
      FROM movies 
      WHERE release_date IS NOT NULL 
      ORDER BY year DESC
    `;
    const [rows] = await db.promise().query(sql);
    const years = rows.map(r => r.year.toString());
    res.json(years);
  } catch (err) {
    console.error("GET MOVIE YEARS ERROR:", err);
    res.status(500).json(err);
  }
};