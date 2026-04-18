const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { parsePagination, buildPagination } = require("../utils/pagination");

/* ================= GET (user) ================= */
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT u.id, u.username, u.email, u.role_id, u.is_vip, u.vip_expired_at, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json(results[0]);
  });
};

/* ================= REGISTER-ĐĂNG KÝ ================= */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ✅ CHECK EMAIL TRƯỚC
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email đã tồn tại",
        });
      }

      // ✅ HASH SAU KHI CHECK OK
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users (username, email, password, role_id)
        VALUES (?, ?, ?, 2)
      `;

      db.query(insertSql, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json(err);

        const { sendToAdmins } = require("../utils/notificationUtils");
        sendToAdmins('Tài khoản mới', `User ${username} (${email}) vừa đăng ký tài khoản mới.`, 'new');

        const user = {
          id: result.insertId,
          username,
          email,
          role_id: 2,
        };

        res.json({
          message: "Register successful",
          user,
        });
      });
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= LOGIN-ĐĂNG NHẬP ================= */
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // ✅ tạo token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ TRẢ THÊM USER (QUAN TRỌNG NHẤT)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        is_vip: user.is_vip,
        vip_expired_at: user.vip_expired_at
      },
    });
  });
};


/* ================= CHANGE PASSWORD (user) ================= */
exports.changePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    const userId = req.user.id; // Lấy id từ token

    // 1️⃣ Lấy hash mật khẩu hiện tại từ DB
    const [results] = await db.promise().query(
      "SELECT password FROM users WHERE id=?",
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const user = results[0];

    // 2️⃣ Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // 3️⃣ Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPass, 10);

    // 4️⃣ Update mật khẩu mới vào DB
    const [updateResult] = await db.promise().query(
      "UPDATE users SET password=? WHERE id=?",
      [hashedPassword, userId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ message: "Cập nhật mật khẩu thất bại" });
    }

    // 5️⃣ Thêm thông báo
    await db.promise().query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
      [userId, "Bảo mật tài khoản", "Mật khẩu của bạn vừa được thay đổi. Nếu bạn không thực hiện hành động này, vui lòng đổi mật khẩu ngay.", "security"]
    );

    res.json({ message: "Đổi mật khẩu thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


/* ================= UPDATE (USER) ================= */
exports.updateUserforUser = (req, res) => {
  const { username } = req.body;
  const id = req.user.id;

  const sql = `
    UPDATE users 
    SET username=?
    WHERE id=?
  `;

  db.query(sql, [username, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    db.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
      [id, "Cập nhật hồ sơ", "Thông tin cá nhân của bạn đã được cập nhật thành công.", "user"],
      () => {
        res.json({ message: "User updated successfully" });
      }
    );
  });
};

/* ================= GET ALL USERS (ADMIN) ================= */
exports.getAllUsers = async (req, res) => {

  // Kiểm tra quyền admin
  if (req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Bạn không có quyền truy cập"
    });
  }

  const { page, limit, offset } = parsePagination(req);
  const search = req.query.search || "";
  const filter = req.query.filter || "all";


  try {
    // 1️⃣ Count total users (with search if provided)
    let countSql = `SELECT COUNT(*) AS total FROM users WHERE 1=1`;
    let countParams = [];
    if (search) {
      countSql += ` AND (username LIKE ? OR email LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (filter === "admin") {
      countSql += ` AND role_id = 1`;
    } else if (filter === "vip") {
      countSql += ` AND is_vip = 1`;
    }

    const [countRows] = await db.promise().query(countSql, countParams);
    const total = countRows[0]?.total || 0;

    // 2️⃣ Count total VIP users (always global, not affected by current search)
    const [vipRows] = await db.promise().query(
      `SELECT COUNT(*) AS totalVip FROM users WHERE is_vip = 1`
    );
    const totalVip = vipRows[0]?.totalVip || 0;

    // 3️⃣ Get users for current page
    let sql = `
      SELECT 
        users.id,
        users.username,
        users.email,
        roles.name AS role_name,
        users.is_vip,
        users.vip_expired_at
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE 1=1
    `;
    let params = [];
    if (search) {
      sql += ` AND (users.username LIKE ? OR users.email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (filter === "admin") {
      sql += ` AND users.role_id = 1`;
    } else if (filter === "vip") {
      sql += ` AND users.is_vip = 1`;
    }

    sql += ` ORDER BY users.id ASC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [results] = await db.promise().query(sql, params);

    res.json({
      data: results,
      pagination: {
        ...buildPagination(page, limit, total),
        totalVip,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= GET USER BY ID (ADMIN) ================= */
exports.getUserById = (req, res) => {
  const { id } = req.params;

  // Check quyền admin (có thể bỏ vì đã có middleware isAdmin)
  if (req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Bạn không có quyền truy cập",
    });
  }

  const sql = `
    SELECT 
      users.id,
      users.username,
      users.email,
      roles.name AS role_name,
      users.is_vip,
      users.vip_expired_at
    FROM users
    JOIN roles ON users.role_id = roles.id
    WHERE users.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User không tồn tại",
      });
    }

    res.json(results[0]);
  });
};

/* ================= UPDATE USER (ADMIN) ================= */
exports.updateUserforAdmin = (req, res) => {
  const { username, email, role_id } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE users 
    SET role_id=?
    WHERE id=?
  `;

  db.query(sql, [role_id, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "User updated successfully" });
  });
};

/* ================= DELETE USER (ADMIN) ================= */
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  // ❌ Không cho tự xoá chính mình
  if (parseInt(id) === currentUserId) {
    return res.status(400).json({
      message: "Bạn không thể tự xóa tài khoản của mình",
    });
  }

  // 🔍 Lấy role của user cần xóa
  const checkSql = "SELECT role_id FROM users WHERE id = ?";

  db.query(checkSql, [id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({
        message: "User không tồn tại",
      });
    }

    const targetUser = results[0];

    // ❌ Không cho xóa Admin
    if (targetUser.role_id === 1) {
      return res.status(403).json({
        message: "Không thể xóa tài khoản Admin",
      });
    }

    // ✅ OK thì mới delete
    db.query("DELETE FROM users WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User deleted successfully" });
    });
  });
};