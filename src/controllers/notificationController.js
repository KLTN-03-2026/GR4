const db = require("../db");

exports.getUserNotifications = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(200).json(results);
  });
};

exports.getUnreadCount = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = FALSE";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(200).json({ unreadCount: results[0].unreadCount });
  });
};

exports.markAsRead = (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;
  const sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";
  db.query(sql, [notificationId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(200).json({ message: "Đã đánh dấu là đã đọc" });
  });
};

exports.markAllAsRead = (req, res) => {
  const userId = req.user.id;
  const sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(200).json({ message: "Đã đánh dấu tất cả là đã đọc" });
  });
};

exports.deleteAllRead = (req, res) => {
  const userId = req.user.id;
  const sql = "DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(200).json({ message: "Đã xóa thông báo đã đọc" });
  });
};

exports.deleteNotification = (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;
  const sql = "DELETE FROM notifications WHERE id = ? AND user_id = ?";
  db.query(sql, [notificationId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(200).json({ message: "Đã xóa thông báo" });
  });
};

// Admin route or internal test route
exports.createNotification = (req, res) => {
  const { user_id, title, message, type } = req.body;
  if (!user_id || !title || !message) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
  }
  const sql = "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, title, message, type || 'info'], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
    res.status(201).json({ message: "Tạo thông báo thành công", insertId: results.insertId });
  });
};
