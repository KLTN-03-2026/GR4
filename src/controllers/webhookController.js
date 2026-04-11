const db = require('../db');
const paymentSessions = require('../utils/paymentSessions');

exports.sepayWebhook = async (req, res) => {
    try {
        const payload = req.body;
        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        console.log(JSON.stringify(payload, null, 2));

        if (payload.transferType !== 'in') {
            return res.json({ success: true, message: "Ignored, not an incoming transaction." });
        }

        const content = payload.content ? payload.content.toUpperCase() : '';
        const amount = parseInt(payload.transferAmount, 10) || 0;

        // New pattern: NAME USERID CINEMA VIP XXXX (4 random chars at the end)
        const match = content.match(/(\d+)\s+CINEMA\s+VIP\s+([A-Z0-9]{4})/);
        if (!match) {
            return res.json({ success: true, message: "Transaction content does not match VIP syntax." });
        }

        const userId = parseInt(match[1], 10);
        const randomCode = match[2];

        // Mark the session as completed
        paymentSessions.completeSession(randomCode);

        // Check user exists
        const [userCheck] = await db.promise().query('SELECT id, username FROM users WHERE id = ?', [userId]);
        if (userCheck.length === 0) {
            return res.json({ success: false, message: "Email không tồn tại" });
        }

        // Compute expire date (30 days)
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        // Upgrade user to VIP
        await db.promise().query(
            'UPDATE users SET is_vip = 1, vip_expired_at = ?, role_id = CASE WHEN role_id = 1 THEN 1 ELSE 2 END WHERE id = ?',
            [expireDate, userId]
        );

        // Save vip_history
        const [vipPackages] = await db.promise().query('SELECT id, title, price FROM vip LIMIT 1');
        const vip = vipPackages[0];
        const startDate = new Date();
        await db.promise().query(
            'INSERT INTO vip_history (user_id, vip_id, price_paid, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [userId, vip?.id || 1, amount, startDate, expireDate]
        );

        // Notification for user
        const notifTitle = 'Thanh toán tự động thành công';
        const notifMessage = `Hệ thống đã ghi nhận khoản thanh toán ${amount.toLocaleString('vi-VN')}đ. Gói VIP của bạn đã được kích hoạt, hạn sử dụng đến ${expireDate.toLocaleDateString('vi-VN')}.`;
        await db.promise().query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, notifTitle, notifMessage, 'billing']
        );

        // Admin notification
        const { sendToAdmins } = require("../utils/notificationUtils");
        const username = userCheck[0].username;
        sendToAdmins('SePay Auto-Pay', `${username} vừa thanh toán tự động thành công gói VIP Cinema+.`, 'billing');

        return res.json({ success: true, message: "User upgraded to VIP successfully via SePay." });
    } catch (err) {
        console.error('SePay Webhook Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};

