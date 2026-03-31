const db = require("../db");
const { parsePagination, buildPagination } = require("../utils/pagination");

// ================= CREATE COMMENT =================
exports.createComment = (req, res) => {
  const user_id = req.user.id;
  const { movieId, content } = req.body;
  const comment = (content || req.body.comment || "").trim();

  if (!movieId) {
    return res.status(400).json({ message: "movieId là bắt buộc" });
  }

  if (!comment) {
    return res.status(400).json({ message: "Nội dung comment không được để trống" });
  }

  const sql = `
    INSERT INTO comments (user_id, movie_id, content, create_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sql, [user_id, movieId, comment], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Comment created", comment_id: result.insertId });
  });
};

// ================= GET COMMENTS BY MOVIE =================
exports.getCommentsByMovie = async (req, res) => {
  const movieId = req.params.movieId;
  const { page, limit, offset } = parsePagination(req);

  try {
    const countSql = `SELECT COUNT(*) AS total FROM comments WHERE movie_id = ?`;
    const [countRows] = await db.promise().query(countSql, [movieId]);
    const total = countRows[0]?.total || 0;

    const query = `
      SELECT
        c.id,
        c.movie_id AS movieId,
        c.user_id AS userId,
        c.content,
        c.create_at AS createdAt,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.movie_id = ?
      ORDER BY c.create_at DESC
      LIMIT ? OFFSET ?
    `;

    const [comments] = await db.promise().query(query, [movieId, limit, offset]);

    res.json({
      data: comments,
      pagination: buildPagination(page, limit, total),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ================= GET ALL COMMENTS (ADMIN) =================
exports.getAllComments = async (req, res) => {
  const { page, limit, offset } = parsePagination(req);

  try {
    const countSql = `SELECT COUNT(*) AS total FROM comments`;
    const [countRows] = await db.promise().query(countSql);
    const total = countRows[0]?.total || 0;

    const sql = `
      SELECT
        c.id,
        c.movie_id AS movieId,
        c.user_id AS userId,
        c.content,
        c.create_at AS createdAt,
        u.username AS user,
        m.title AS movie
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN movies m ON c.movie_id = m.id
      ORDER BY c.create_at DESC
      LIMIT ? OFFSET ?
    `;

    const [comments] = await db.promise().query(sql, [limit, offset]);

    res.json({
      data: comments,
      pagination: buildPagination(page, limit, total),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ================= DELETE COMMENT =================
exports.deleteComment = (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const roleId = req.user.role_id;

  const selectSql = `SELECT user_id FROM comments WHERE id = ?`;

  db.query(selectSql, [commentId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "Comment không tồn tại" });
    }

    const ownerId = results[0].user_id;
    if (roleId !== 1 && ownerId !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xoá comment này" });
    }

    const deleteSql = `DELETE FROM comments WHERE id = ?`;
    db.query(deleteSql, [commentId], (deleteErr, deleteResult) => {
      if (deleteErr) return res.status(500).json(deleteErr);
      res.json({ message: "Comment đã được xoá" });
    });
  });
};
