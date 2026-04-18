const db = require("../db");

exports.sendToAdmins = async (title, message, type) => {
    try {
        const [admins] = await db.promise().query('SELECT id FROM users WHERE role_id = 1');
        if (admins.length > 0) {
            const values = admins.map(admin => [admin.id, title, message, type || 'info']);
            await db.promise().query(
                'INSERT INTO notifications (user_id, title, message, type) VALUES ?',
                [values]
            );
        }
    } catch (err) {
        console.error('Lỗi khi gửi thông báo tới Admins:', err);
    }
};
