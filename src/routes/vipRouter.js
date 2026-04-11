const express = require('express');
const router = express.Router();
const vipController = require('../controllers/vipController');
const { verifyToken } = require('../middlewares/usersMiddleware');
const paymentSessions = require('../utils/paymentSessions');

router.get('/', vipController.getVipPackages);
router.get('/history', verifyToken, vipController.getVipHistory);
router.post('/upgrade', verifyToken, vipController.upgradeVip);
router.post('/cancel', verifyToken, vipController.cancelVip);

// Payment session management
router.post('/session', verifyToken, (req, res) => {
    const { randomCode, amount } = req.body;
    if (!randomCode || randomCode.length !== 4) {
        return res.status(400).json({ success: false, message: 'Invalid randomCode' });
    }
    // Clean old sessions periodically
    paymentSessions.cleanOldSessions();
    const session = paymentSessions.createSession(
        req.user.id,
        req.user.username || req.user.name,
        randomCode.toUpperCase(),
        amount
    );
    res.json({ success: true, session });
});

router.get('/session/:code', verifyToken, (req, res) => {
    const code = req.params.code.toUpperCase();
    const session = paymentSessions.getSession(code);
    if (!session) return res.json({ success: false, status: 'not_found' });
    res.json({ success: true, status: session.status, session });
});

module.exports = router;
