const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { verifyToken, isAdmin } = require('../middlewares/usersMiddleware');
const paymentSessions = require('../utils/paymentSessions');

router.get('/', verifyToken, isAdmin, statisticsController.getStatistics);
router.get('/revenue-history', verifyToken, isAdmin, statisticsController.getRevenueHistory);

// Return paginated and filtered in-memory payment sessions for admin dashboard
router.get('/payment-sessions', verifyToken, isAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'all';
    
    const result = paymentSessions.getAllSessions(page, limit, status);
    res.json({ success: true, ...result });
});

module.exports = router;
