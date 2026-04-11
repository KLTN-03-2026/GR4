const aiService = require('../services/aiService');
const contextService = require('../services/contextService');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CONTROLLER: AI CHAT - Xử lý chat 2 lớp (Intent Detection + RAG)
 * ═══════════════════════════════════════════════════════════════════════
 */

// Rate limiter dùng Map — 20 req/60s per sessionId|IP
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(key) {
    const now = Date.now();
    const record = rateLimitMap.get(key);
    if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(key, { count: 1, windowStart: now });
        return true;
    }
    if (record.count >= RATE_LIMIT_MAX) return false;
    record.count++;
    return true;
}

/**
 * Tạo System Prompt cho AI (Layer 2)
 */
const createSystemPrompt = (context) => {
    return {
        role: "system",
        content: `Bạn là AI trợ lý thân thiện của Cinema New 🎬

QUY TẮC QUAN TRỌNG:
1. CHỈ dùng thông tin từ CONTEXT bên dưới. TUYỆT ĐỐI KHÔNG BỊA (hallucinate) thông tin phim không có trong Database.
2. Nếu Context ghi là [KHÔNG TÌM THẤY PHIM] -> Hãy thành thật xin lỗi và báo là kho phim hiện chưa có, TUYỆT ĐỐI KHÔNG gợi ý phim bừa bãi.
3. Phim: dùng block \`\`\`moviecard cho từng phim. CHỈ chứa nội dung JSON duy nhất giữa { và }. TUYỆT ĐỐI không chứa tiêu đề (như # Tên phim), Markdown hay mô tả bên trong block này.
4. VIP: giới thiệu các gói và dùng cú pháp [CTA:Nâng cấp VIP ngay|/vip] để tạo nút bấm. Link dẫn là /vip.
5. Đăng nhập: CHỈ gợi ý đăng nhập tại /login nếu nhìn Context thấy user CHƯA đăng nhập. Tuyệt đối KHÔNG nhắc chuyện đăng nhập nếu user đã login (nhìn context [TRẠNG THÁI: ĐÃ ĐĂNG NHẬP]).
6. Nút bấm tương tác: Có thể dùng cú pháp [CTA:Tên nút|/đường-dẫn] để tạo nút bấm nhanh (Ví dụ: [CTA:Về trang chủ|/], [CTA:Xem trang cá nhân|/profile]).
7. Nếu context yêu cầu trả về flag [NEED_LOGIN], hãy đặt nó ở cuối câu trả lời nếu user thực sự chưa login.

═══════════════════════════════════════════════════════════════
                    CONTEXT DATABASE
═══════════════════════════════════════════════════════════════
${context}
═══════════════════════════════════════════════════════════════

Hãy trả lời tự nhiên, thân thiện và hữu ích!`
    };
};

/**
 * Ánh xạ Intent sang thông điệp trạng thái cho Frontend
 */
const getIntentStatusMsg = (intentObj) => {
    const { intent, subIntent } = intentObj;
    if (intent === 'MOVIE') {
        if (subIntent === 'search_by_mood') return '🔍 Đang tìm phim theo tâm trạng...';
        if (subIntent === 'similar') return '🎬 Đang tìm phim tương tự...';
        return '🔍 Đang tra cứu kho phim...';
    }
    if (intent === 'VIP') return '👑 Đang kiểm tra thông tin VIP...';
    if (intent === 'ACCOUNT') return '👤 Đang truy xuất thông tin tài khoản...';
    return '💬 Đang xử lý câu hỏi...';
};

/**
 * Sinh Quick Actions động dựa trên Intent
 */
const generateDynamicQuickActions = (intentObj) => {
    const { intent } = intentObj;
    if (intent === 'MOVIE') {
        return [
            { id: 'hot', icon: '🔥', label: 'Phim hot', prompt: 'Cho tôi xem phim đang hot nhất' },
            { id: 'new', icon: '🆕', label: 'Phim mới', prompt: 'Phim mới cập nhật gần đây' },
            { id: 'mood_sad', icon: '😢', label: 'Phim buồn', prompt: 'Tìm cho tôi phim nào buồn buồn' },
            { id: 'mood_funny', icon: '😂', label: 'Phim hài', prompt: 'Tôi muốn xem phim gì đó hài hước' }
        ];
    }
    if (intent === 'VIP') {
        return [
            { id: 'pricing', icon: '💰', label: 'Giá VIP', prompt: 'Các gói VIP giá thế nào?' },
            { id: 'check', icon: '✅', label: 'Check VIP', prompt: 'Kiểm tra trạng thái VIP của tôi' },
            { id: 'buy', icon: '🛒', label: 'Mua VIP', prompt: 'Hướng dẫn tôi mua VIP' }
        ];
    }
    // Mặc định cho GENERAL hoặc ACCOUNT
    return [
        { id: 'trending', icon: '🔥', label: 'Phim hot', prompt: 'Cho tôi xem phim đang hot nhất' },
        { id: 'vip', icon: '👑', label: 'Gói VIP', prompt: 'Cho tôi biết về các gói VIP' },
        { id: 'history', icon: '🕒', label: 'Lịch sử xem', prompt: 'Tôi đã xem phim gì gần đây?' }
    ];
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MAIN CHAT HANDLER
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.chat = async (req, res) => {
    const { message } = req.body;
    const userId = req.user ? req.user.id : null;

    let sessionId = req.cookies?.chat_session_id;
    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie('chat_session_id', sessionId, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
    }

    const rateLimitKey = sessionId || req.ip;
    if (!checkRateLimit(rateLimitKey)) {
        return res.status(429).json({ success: false, message: 'Spam alert! Vui lòng đợi 1 phút.' });
    }

    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Tin nhắn trống.' });

    try {
        // SETUP SSE HEADERS NGAY ĐỂ GỬI STATUS
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // ──────────────────────────────────────────────────────────
        // 1. LAYER 1: INTENT DETECTION
        // ──────────────────────────────────────────────────────────
        // Lấy 3 tin nhắn cuối từ DB để làm context cho classifier
        const [recentHistory] = await db.promise().query(
            `SELECT role, content FROM chat_history 
             WHERE (user_id = ? OR session_id = ?) 
             ORDER BY created_at DESC LIMIT 3`, 
            [userId, sessionId]
        );
        const classificationHistory = recentHistory.reverse();

        const intentObj = await aiService.getIntent(message, classificationHistory);
        const intent = intentObj.intent;

        // ──────────────────────────────────────────────────────────
        // 2. SEND STATUS TO CLIENT
        // ──────────────────────────────────────────────────────────
        const statusMsg = getIntentStatusMsg(intentObj);
        res.write(`data: ${JSON.stringify({ type: 'status', message: statusMsg })}\n\n`);

        // ──────────────────────────────────────────────────────────
        // 3. LAYER 2: CONTEXT RETRIEVAL (RAG)
        // ──────────────────────────────────────────────────────────
        const context = await contextService.getRelevantContext(intentObj, userId);

        // ──────────────────────────────────────────────────────────
        // 4. LAYER 2: CHAT RESPONSE
        // ──────────────────────────────────────────────────────────
        // Chuẩn bị lịch sử cho Layer 2 (giới hạn độ dài)
        const chatHistoryForLayer2 = classificationHistory.map(h => ({
            role: h.role,
            content: h.content.substring(0, 300)
        }));

        const systemPrompt = createSystemPrompt(context);
        const messages = [
            systemPrompt,
            ...chatHistoryForLayer2,
            { role: 'user', content: message }
        ];

        const { stream, isOllama } = await aiService.getChatStream(messages);

        let fullContent = "";
        let buffer = "";

        const processLine = (line) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            try {
                let content = "";
                if (isOllama) {
                    const parsed = JSON.parse(trimmed);
                    content = parsed.message?.content || "";
                    if (content) {
                        fullContent += content;
                        res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                    }
                } else {
                    if (!trimmed.startsWith("data:")) return;
                    const dataStr = trimmed.slice(5).trim();
                    if (dataStr === "[DONE]") return;
                    const parsed = JSON.parse(dataStr);
                    content = parsed.choices?.[0]?.delta?.content || "";
                    if (content) {
                        fullContent += content;
                        res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                    }
                }
            } catch (e) {}
        };

        stream.on('data', (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || "";
            for (const line of lines) processLine(line);
        });

        stream.on('end', async () => {
            if (buffer.trim()) processLine(buffer);

            // Gửi Quick Actions động & done signal
            const quickActions = generateDynamicQuickActions(intentObj);
            res.write(`data: ${JSON.stringify({ done: true, quickActions })}\n\n`);

            // SAVE TO DB
            if (fullContent.trim()) {
                try {
                    // Lưu user message trước (nếu chưa lưu) - Ở đây ta đã lưu trong bản trước?
                    // Hãy lưu cả 2 để đồng bộ
                    await db.promise().query(
                        `INSERT INTO chat_history (user_id, session_id, role, content, intent) VALUES (?, ?, ?, ?, ?)`,
                        [userId, sessionId, 'user', message, intent]
                    );
                    await db.promise().query(
                        `INSERT INTO chat_history (user_id, session_id, role, content, intent) VALUES (?, ?, ?, ?, ?)`,
                        [userId, sessionId, 'assistant', fullContent.substring(0, 5000), intent]
                    );
                } catch (dbErr) { console.error("DB Save Fail:", dbErr); }
            }
            res.end();
        });

        stream.on('error', (err) => {
            res.write(`data: ${JSON.stringify({ error: 'AI Stream Error', done: true })}\n\n`);
            res.end();
        });

    } catch (err) {
        console.error("❌ ChatController Fail:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Lỗi server', done: true })}\n\n`);
            res.end();
        }
    }
};

exports.getHistory = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies?.chat_session_id;
    if (!userId && !sessionId) return res.json({ success: true, history: [] });
    try {
        const [rows] = await db.promise().query(
            `SELECT id, role, content, intent, created_at FROM chat_history 
             WHERE (user_id = ? OR session_id = ?) ORDER BY created_at ASC LIMIT 100`,
            [userId, sessionId]
        );
        res.json({
            success: true,
            history: rows.map(r => ({ id: r.id, role: r.role, content: r.content, intent: r.intent, timestamp: r.created_at }))
        });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi lịch sử.' }); }
};

exports.clearHistory = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies?.chat_session_id;
    try {
        await db.promise().query(`DELETE FROM chat_history WHERE user_id = ? OR session_id = ?`, [userId, sessionId]);
        res.json({ success: true, message: 'Đã xóa.' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi xóa.' }); }
};

exports.getQuickActions = (req, res) => {
    // Trả về mặc định
    const actions = [
        { id: 'trending', icon: '🔥', label: 'Phim hot', prompt: 'Cho tôi xem phim đang hot nhất' },
        { id: 'vip', icon: '👑', label: 'Gói VIP', prompt: 'Cho tôi biết về các gói VIP' },
        { id: 'recommend', icon: '🎬', label: 'Gợi ý phim', prompt: 'Gợi ý phim hay để xem' }
    ];
    res.json({ success: true, actions });
};