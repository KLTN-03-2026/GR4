const db = require('../db');

exports.getVipPackages = (req, res) => {
    db.query('SELECT id, title, price FROM vip LIMIT 1', (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy thông tin VIP:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server', error: err });
        }
        res.status(200).json({ success: true, vip: results[0] });
    });
};

exports.getVipHistory = (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT h.id, v.title, h.price_paid, h.start_date, h.end_date 
        FROM vip_history h
        JOIN vip v ON h.vip_id = v.id
        WHERE h.user_id = ?
        ORDER BY h.start_date DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy lịch sử VIP:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server', error: err });
        }
        res.status(200).json({ success: true, history: results });
    });
};

exports.upgradeVip = async (req, res) => {
    const userId = req.user.id;
    try {
        // 1. Lấy thông tin gói VIP mặc định
        const [vipPackages] = await db.promise().query('SELECT id, title, price FROM vip LIMIT 1');
        if (vipPackages.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy gói VIP' });
        }
        const vip = vipPackages[0];

        // 2. Tính ngày hết hạn (30 ngày từ hiện tại)
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        // 3. Cập nhật bảng users
        await db.promise().query(
            'UPDATE users SET is_vip = 1, vip_expired_at = ? WHERE id = ?',
            [expireDate, userId]
        );

        // 4. Lưu vào lịch sử nâng cấp
        const startDate = new Date();
        await db.promise().query(
            'INSERT INTO vip_history (user_id, vip_id, price_paid, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [userId, vip.id, vip.price, startDate, expireDate]
        );

        // 5. Thêm thông báo
        const notifTitle = 'Nâng cấp VIP thành công';
        const notifMessage = `Chúc mừng bạn đã nâng cấp gói VIP. Hạn sử dụng đến ngày ${expireDate.toLocaleDateString('vi-VN')}.`;
        await db.promise().query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, notifTitle, notifMessage, 'billing']
        );

        // 6. Thông báo Admin kèm tên user
        const { sendToAdmins } = require("../utils/notificationUtils");
        const [userRows] = await db.promise().query('SELECT username FROM users WHERE id = ?', [userId]);
        const username = userRows[0]?.username || `User #${userId}`;
        sendToAdmins('VIP Mới', `${username} vừa nâng cấp / mua gói VIP Cinema+.`, 'billing');

        res.status(200).json({
            success: true,
            message: 'Nâng cấp VIP thành công!',
            expireDate
        });
    } catch (err) {
        console.error('Lỗi nâng cấp VIP:', err);
        res.status(500).json({ success: false, message: 'Lỗi server khi nâng cấp VIP', error: err.message });
    }
};

exports.cancelVip = async (req, res) => {
    const userId = req.user.id;
    try {
        // 1. Cập nhật bảng users
        await db.promise().query(
            'UPDATE users SET is_vip = 0, vip_expired_at = NULL WHERE id = ?',
            [userId]
        );

        // 2. Thêm thông báo
        const notifTitle = 'Hủy gói VIP';
        const notifMessage = 'Bạn đã hủy gia hạn gói VIP. Các quyền lợi VIP sẽ bị ngưng và trở về trạng thái cơ bản.';
        await db.promise().query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, notifTitle, notifMessage, 'billing']
        );

        res.status(200).json({
            success: true,
            message: 'Hủy gói VIP thành công!'
        });
    } catch (err) {
        console.error('Lỗi hủy VIP:', err);
        res.status(500).json({ success: false, message: 'Lỗi server khi hủy VIP', error: err.message });
    }
};
