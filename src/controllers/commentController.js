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
    INSERT INTO comments (user_id, movie_id, comment, created_at)
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
        c.comment AS content,
        c.created_at AS createdAt,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.movie_id = ?
      ORDER BY c.created_at DESC
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
  const search = req.query.search || "";

  try {
    // 1️⃣ Count total comments (with search if provided)
    let countSql = `
      SELECT COUNT(*) AS total 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN movies m ON c.movie_id = m.id
      WHERE 1=1
    `;
    let countParams = [];
    if (search) {
      countSql += ` AND (c.comment LIKE ? OR u.username LIKE ? OR m.title LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [countRows] = await db.promise().query(countSql, countParams);
    const total = countRows[0]?.total || 0;

    // 2️⃣ Get comments for current page
    let sql = `
      SELECT
        c.id,
        c.movie_id AS movieId,
        c.user_id AS userId,
        c.comment AS content,
        c.created_at AS createdAt,
        u.username AS user,
        m.title AS movie
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN movies m ON c.movie_id = m.id
      WHERE 1=1
    `;
    let params = [];
    if (search) {
      sql += ` AND (c.comment LIKE ? OR u.username LIKE ? OR m.title LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [comments] = await db.promise().query(sql, params);

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
