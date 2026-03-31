const db = require("../db");

exports.createOrUpdateRating = (req, res) => {
  const user_id = req.user.id;
  const { movieId, value } = req.body;
  const ratingValue = Number(value);

  if (!movieId) {
    return res.status(400).json({ message: "movieId là bắt buộc" });
  }

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json({ message: "Rating phải là số từ 1 đến 5" });
  }

  const selectSql = `
    SELECT id
    FROM ratings
    WHERE user_id = ? AND movie_id = ?
  `;

  db.query(selectSql, [user_id, movieId], (err, existing) => {
    if (err) return res.status(500).json(err);

    if (existing.length > 0) {
      const updateSql = `
        UPDATE ratings
        SET value = ?, updated_at = NOW()
        WHERE user_id = ? AND movie_id = ?
      `;

      db.query(updateSql, [ratingValue, user_id, movieId], (updateErr) => {
        if (updateErr) return res.status(500).json(updateErr);
        return res.json({ message: "Rating updated", value: ratingValue, movieId });
      });
    } else {
      const insertSql = `
        INSERT INTO ratings (user_id, movie_id, value)
        VALUES (?, ?, ?)
      `;

      db.query(insertSql, [user_id, movieId, ratingValue], (insertErr, result) => {
        if (insertErr) return res.status(500).json(insertErr);
        return res.json({ message: "Rating created", value: ratingValue, movieId, id: result.insertId });
      });
    }
  });
};

exports.getRatingsByMovie = (req, res) => {
  const movieId = req.params.movieId;

  const ratingsSql = `
    SELECT
      r.id,
      r.movie_id AS movieId,
      r.user_id AS userId,
      r.value,
      r.updated_at AS updatedAt,
      u.username
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.movie_id = ?
    ORDER BY r.updated_at DESC
  `;

  db.query(ratingsSql, [movieId], (err, ratings) => {
    if (err) return res.status(500).json(err);

    const statsSql = `
      SELECT
        IFNULL(ROUND(AVG(value), 1), 0) AS averageRating,
        COUNT(*) AS ratingCount
      FROM ratings
      WHERE movie_id = ?
    `;

    db.query(statsSql, [movieId], (statsErr, statsResult) => {
      if (statsErr) return res.status(500).json(statsErr);
      const stats = statsResult[0] || { averageRating: 0, ratingCount: 0 };
      res.json({ ratings, averageRating: Number(stats.averageRating), ratingCount: stats.ratingCount });
    });
  });
};

exports.getUserRatingByMovie = (req, res) => {
  const movieId = req.params.movieId;
  const user_id = req.user.id;

  const sql = `
    SELECT id, movie_id AS movieId, user_id AS userId, value, updated_at AS updatedAt
    FROM ratings
    WHERE movie_id = ? AND user_id = ?
    LIMIT 1
  `;

  db.query(sql, [movieId, user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.json({ value: null });
    }
    res.json(results[0]);
  });
};
