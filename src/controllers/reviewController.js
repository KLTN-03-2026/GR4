const db = require("../db");


// ================= CREATE REVIEW =================
exports.createReview = (req, res) => {

  const user_id = req.user.id;
  const movie_id = req.params.movie_id;
  const { rating, comment } = req.body;

  const sql = `
    INSERT INTO reviews (user_id, movie_id, rating, comment, create_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [user_id, movie_id, rating, comment], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Review created",
      review_id: result.insertId
    });

  });

};



// ================= GET REVIEWS BY MOVIE =================
exports.getReviewsByMovie = (req, res) => {
  const movie_id = req.params.movie_id;

  const sql = `
    SELECT r.*, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.movie_id = ?
    ORDER BY r.create_at DESC
  `;

  db.query(sql, [movie_id], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};



// ================= UPDATE REVIEW =================
exports.updateReview = (req, res) => {
  const review_id = req.params.id;
  const user_id = req.user.id;
  const { rating, comment } = req.body;

  const sql = `
    UPDATE reviews
    SET rating=?, comment=?
    WHERE id=? AND user_id=?
  `;

  db.query(sql, [rating, comment, review_id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Bạn không có quyền sửa review này"
      });
    }

    res.json({ message: "Review updated" });
  });
};



// ================= DELETE REVIEW =================
exports.deleteReview = (req, res) => {
  const review_id = req.params.id;
  const user_id = req.user.id;
  const role_id = req.user.role_id;

  // ===== ADMIN: chỉ xoá comment =====
  if (role_id === 1) {

    const sql = `
      UPDATE reviews
      SET comment = NULL
      WHERE id = ?
    `;

    db.query(sql, [review_id], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Admin đã xoá comment, rating vẫn được giữ"
      });
    });

  }

  // ===== USER: xoá review của chính mình =====
  else {

    const sql = `
      DELETE FROM reviews
      WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [review_id, user_id], (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "Bạn không có quyền xoá review này"
        });
      }

      res.json({
        message: "Review đã bị xoá"
      });
    });

  }
};