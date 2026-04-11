const db = require("../db");

/* ================= FAVORITES: GET FAVORITES ================= */
exports.getFavorites = (req, res) => {
  const userId = req.user.id;

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
      GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM favorites f
    JOIN movies m ON f.movie_id = m.id
    LEFT JOIN countries c ON m.country_id = c.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE f.user_id = ?
    GROUP BY m.id
    ORDER BY m.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/* ================= FAVORITES: ADD FAVORITE ================= */
exports.addFavorite = (req, res) => {
  const userId = req.user.id;
  const { movie_id } = req.body;

  if (!movie_id) {
    return res.status(400).json({ message: "movie_id là bắt buộc" });
  }

  const sql = `INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)`;

  db.query(sql, [userId, movie_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Đã thêm vào danh sách yêu thích", added: result.affectedRows > 0 });
  });
};

/* ================= FAVORITES: REMOVE FAVORITE ================= */
exports.removeFavorite = (req, res) => {
  const userId = req.user.id;
  const { movie_id } = req.params;

  const sql = `DELETE FROM favorites WHERE user_id = ? AND movie_id = ?`;

  db.query(sql, [userId, movie_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Yêu thích không tồn tại" });
    }
    res.json({ message: "Đã xóa khỏi danh sách yêu thích" });
  });
};
