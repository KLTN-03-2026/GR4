const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyTokenOptional } = require('../middlewares/usersMiddleware');

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ROUTES: AI CHAT - Các endpoints cho chatbot AI
 * ═══════════════════════════════════════════════════════════════════════
 * Base path: /api/ai
 */

// ──────────────────────────────────────────────────────────────
// CHAT ENDPOINTS
// ──────────────────────────────────────────────────────────────

/**
 * @route   POST /api/ai/chat
 * @desc    Gửi tin nhắn và nhận response từ AI (streaming)
 * @access  Public (Optional Auth)
 */
router.post('/chat', verifyTokenOptional, chatController.chat);

/**
 * @route   GET /api/ai/history
 * @desc    Lấy lịch sử chat của user/session
 * @access  Public (Optional Auth)
 */
router.get('/history', verifyTokenOptional, chatController.getHistory);

/**
 * @route   DELETE /api/ai/history
 * @desc    Xóa lịch sử chat
 * @access  Public (Optional Auth)
 */
router.delete('/history', verifyTokenOptional, chatController.clearHistory);

/**
 * @route   GET /api/ai/quick-actions
 * @desc    Lấy danh sách quick actions (gợi ý nhanh)
 * @access  Public
 */
router.get('/quick-actions', chatController.getQuickActions);

/**
 * @route   GET /api/ai/health
 * @desc    Kiểm tra trạng thái AI service
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        const aiService = require('../services/aiService');
        const status = await aiService.checkHealth();

        res.json({
            success: true,
            status: {
                cloud: status.cloud,
                local: status.local,
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;