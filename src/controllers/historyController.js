const db = require("../db");

// Record watch history
exports.addToHistory = async (req, res) => {
  const { movie_id } = req.body;
  const user_id = req.user.id;

  if (!movie_id) {
    return res.status(400).json({ message: "movie_id is required" });
  }

  try {
    // Manual UPSERT for compatibity with table that lacks composite unique key
    const updateSql = `UPDATE watch_history SET updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND movie_id = ?`;
    const [updateResult] = await db.promise().query(updateSql, [user_id, movie_id]);

    if (updateResult.affectedRows === 0) {
      const insertSql = `INSERT INTO watch_history (user_id, movie_id, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`;
      await db.promise().query(insertSql, [user_id, movie_id]);
    }
    
    res.status(200).json({ message: "History updated" });
  } catch (err) {
    console.error("ADD TO HISTORY ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's recent history
exports.getHistoryMe = async (req, res) => {
  const user_id = req.user.id;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const sql = `
      SELECT 
        h.updated_at AS watched_at,
        m.id,
        m.title,
        m.avatar_url,
        m.release_date,
        m.movie_url,
        m.required_vip_level,
        c.name AS country,
        GROUP_CONCAT(g.name) AS genres
      FROM watch_history h
      JOIN movies m ON h.movie_id = m.id
      LEFT JOIN countries c ON m.country_id = c.id
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE h.user_id = ?
      GROUP BY h.id, m.id
      ORDER BY h.updated_at DESC
      LIMIT ?
    `;

    const [rows] = await db.promise().query(sql, [user_id, limit]);
    res.json(rows);
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete single history item
exports.deleteHistoryItem = async (req, res) => {
    const { movie_id } = req.params;
    const user_id = req.user.id;

    try {
        await db.promise().query("DELETE FROM watch_history WHERE user_id = ? AND movie_id = ?", [user_id, movie_id]);
        res.json({ message: "Item deleted from history" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Clear all history
exports.clearHistory = async (req, res) => {
    const user_id = req.user.id;

    try {
        await db.promise().query("DELETE FROM watch_history WHERE user_id = ?", [user_id]);
        res.json({ message: "History cleared" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};
