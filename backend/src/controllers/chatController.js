const aiService = require('../services/aiService');
const contextService = require('../services/contextService');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CONTROLLER: AI CHAT - Xử lý chat streaming với AI
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Tạo System Prompt cho AI
 */
const createSystemPrompt = (context) => {
    return {
        role: "system",
        content: `Bạn là AI trợ lý thân thiện của Cinema New - website xem phim online 🎬

═══════════════════════════════════════════════════════════════
                    TÍNH CÁCH & PHONG CÁCH
═══════════════════════════════════════════════════════════════
• Thân thiện, vui vẻ, dùng emoji phù hợp
• Xưng "tôi", gọi khách là "bạn" hoặc TÊN KHÁCH nếu có trong context
• Trả lời ngắn gọn, đi thẳng vào vấn đề
• Nhiệt tình giúp đỡ, không từ chối hỗ trợ

═══════════════════════════════════════════════════════════════
                    KHẢ NĂNG CỦA BẠN
═══════════════════════════════════════════════════════════════
✅ Tìm kiếm phim theo thể loại, tên, rating
✅ Giới thiệu gói VIP và hướng dẫn nâng cấp
✅ Kiểm tra trạng thái VIP của khách (nếu đã login)
✅ Xưng hô bằng tên khách (nếu có trong context)
✅ Chat tự nhiên, trả lời câu hỏi chung

═══════════════════════════════════════════════════════════════
                    QUY TẮC QUAN TRỌNG
═══════════════════════════════════════════════════════════════
1. CHỈ dùng thông tin từ CONTEXT bên dưới
2. KHÔNG bịa tên phim, giá VIP, thông tin không có
3. Nếu không tìm thấy → gợi ý khách hỏi khác, đừng nói "không hỗ trợ"
4. Với phim → hiển thị bằng block \`\`\`moviecard
5. Với VIP → giới thiệu hấp dẫn, hướng dẫn link /vip (ĐÚNG LINK)

═══════════════════════════════════════════════════════════════
                    FORMAT PHIM (moviecard)
═══════════════════════════════════════════════════════════════
MỖI PHIM = 1 block riêng, ĐÚNG FORMAT JSON:

\`\`\`moviecard
{"id":16,"title":"John Wick","poster":"https://...","rating":3.0,"year":2014,"genre":"Hành Động","is_vip":true}
\`\`\`

⚠️ LƯU Ý:
- KHÔNG thêm slug vào JSON
- Link phim: /movie/{ID} (VD: /movie/16)
- Link VIP: /vip

═══════════════════════════════════════════════════════════════
                    VÍ DỤ TRẢ LỜI TỐT
═══════════════════════════════════════════════════════════════

User: "phim hành động"
AI: "Chào bạn! 🎬 Cinema New có nhiều phim hành động hay:

\`\`\`moviecard
{"id":16,"title":"John Wick","poster":"https://...","rating":3.0,"year":2014,"genre":"Hành Động","is_vip":true}
\`\`\`

\`\`\`moviecard
{"id":10,"title":"Inception","poster":"https://...","rating":3.5,"year":2010,"genre":"Hành Động","is_vip":false}
\`\`\`

Bạn muốn xem phim nào? 😊"

---

User: "mua vip"
AI: "Bạn muốn nâng cấp VIP? Tuyệt vời! 👑

Cinema New có gói VIP PREMIUM: 450.000 VNĐ/30 ngày

Quyền lợi:
• Xem phim VIP không giới hạn
• Không quảng cáo
• Chất lượng HD/4K

👉 Nâng cấp ngay: [Nâng cấp VIP](/vip)

Bạn cần tư vấn thêm không? 😊"

═══════════════════════════════════════════════════════════════
                    CONTEXT DATABASE
═══════════════════════════════════════════════════════════════

${context}

═══════════════════════════════════════════════════════════════

Hãy trả lời tự nhiên, thân thiện!`
    };
};

/**
 * Phát hiện Intent từ message
 */
const detectIntent = (message) => {
    const msg = message.toLowerCase().trim();

    const keywords = {
        MOVIE_SEARCH: ['tìm phim', 'phim nào', 'xem phim', 'có phim', 'search'],
        MOVIE_RECOMMEND: ['gợi ý', 'phim hay', 'trending', 'hot', 'nên xem'],
        VIP_INFO: ['vip', 'gói', 'nâng cấp', 'giá vip', 'đăng ký'],
        GENERAL: ['hướng dẫn', 'help', 'trợ giúp']
    };

    for (const [intent, words] of Object.entries(keywords)) {
        if (words.some(keyword => msg.includes(keyword))) {
            return intent;
        }
    }

    return 'GENERAL';
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MAIN CHAT HANDLER - Streaming Response
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.chat = async (req, res) => {
    const { message } = req.body;
    const userId = req.user ? req.user.id : null;

    // Tạo hoặc lấy session_id từ cookie
    let sessionId = req.cookies?.chat_session_id;
    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie('chat_session_id', sessionId, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
    }

    // ──────────────────────────────────────────────────────────────
    // VALIDATION
    // ──────────────────────────────────────────────────────────────
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Nội dung tin nhắn không được trống.'
        });
    }

    if (message.length > 500) {
        return res.status(400).json({
            success: false,
            message: 'Tin nhắn quá dài. Vui lòng nhập tối đa 500 ký tự.'
        });
    }

    try {
        // ──────────────────────────────────────────────────────────
        // 1. DETECT INTENT
        // ──────────────────────────────────────────────────────────
        const intent = detectIntent(message);

        // ──────────────────────────────────────────────────────────
        // 2. SAVE USER MESSAGE TO DB
        // ──────────────────────────────────────────────────────────
        await db.promise().query(
            `INSERT INTO chat_history (user_id, session_id, role, content, intent) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, sessionId, 'user', message, intent]
        );

        // ──────────────────────────────────────────────────────────
        // 3. FETCH CONTEXT FROM DATABASE
        // ──────────────────────────────────────────────────────────
        const rawContext = await contextService.getRelevantContext(message, userId);
        const context = rawContext.substring(0, 3000);

        // ──────────────────────────────────────────────────────────
        // 4. FETCH RECENT CHAT HISTORY
        // ──────────────────────────────────────────────────────────
        const [recentHistory] = await db.promise().query(
            `SELECT role, content 
             FROM chat_history 
             WHERE (user_id = ? OR session_id = ?)
             AND role IN ('user', 'assistant')
             ORDER BY created_at DESC 
             LIMIT 4`,
            [userId, sessionId]
        );

        const historyMessages = recentHistory.reverse().map(h => ({
            role: h.role,
            content: h.content.substring(0, 300)
        }));

        // ──────────────────────────────────────────────────────────
        // 5. BUILD MESSAGES ARRAY FOR AI
        // ──────────────────────────────────────────────────────────
        const systemPrompt = createSystemPrompt(context);
        const messages = [
            systemPrompt,
            ...historyMessages.slice(-3),
            { role: 'user', content: message }
        ];

        // ──────────────────────────────────────────────────────────
        // 6. GET AI STREAM
        // ──────────────────────────────────────────────────────────
        console.log(`💬 [Chat] User: ${userId || 'Guest'}, Intent: ${intent}, Query: "${message}"`);

        const { stream, isOllama } = await aiService.getChatStream(messages);

        // ──────────────────────────────────────────────────────────
        // 7. SETUP SSE HEADERS
        // ──────────────────────────────────────────────────────────
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        let fullContent = "";
        let buffer = "";
        let chunkCount = 0;

        // ──────────────────────────────────────────────────────────
        // 8. PROCESS STREAM - ROBUST PARSER
        // ──────────────────────────────────────────────────────────
        const processLine = (line) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            try {
                let content = "";

                if (isOllama) {
                    // Ollama format
                    const parsed = JSON.parse(trimmed);
                    content = parsed.message?.content || "";

                    if (content) {
                        fullContent += content;
                        res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                    }

                    if (parsed.done) {
                        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                    }
                } else {
                    // Groq/OpenAI SSE format
                    if (!trimmed.startsWith("data:")) return;

                    const dataStr = trimmed.slice(5).trim();

                    if (dataStr === "[DONE]") {
                        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                        return;
                    }

                    const parsed = JSON.parse(dataStr);
                    content = parsed.choices?.[0]?.delta?.content || "";

                    if (content) {
                        fullContent += content;
                        res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                    }
                }
            } catch (parseError) {
                // Ignore partial chunks - không log nữa để tránh spam
            }
        };

        stream.on('data', (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || "";

            for (const line of lines) {
                processLine(line);
                chunkCount++;
            }
        });

        // ──────────────────────────────────────────────────────────
        // 9. STREAM END
        // ──────────────────────────────────────────────────────────
        stream.on('end', async () => {
            // Xử lý dòng cuối trong buffer
            if (buffer.trim()) {
                processLine(buffer);
            }

            console.log(`✅ [Chat] Stream ended. Chunks: ${chunkCount}, Length: ${fullContent.length}`);

            // Gửi done signal
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);

            // Lưu vào DB
            if (fullContent.trim().length > 0) {
                try {
                    await db.promise().query(
                        `INSERT INTO chat_history (user_id, session_id, role, content, intent) 
                         VALUES (?, ?, ?, ?, ?)`,
                        [userId, sessionId, 'assistant', fullContent, intent]
                    );
                } catch (dbError) {
                    console.error("❌ Failed to save assistant message:", dbError);
                }
            }

            res.end();
        });

        // ──────────────────────────────────────────────────────────
        // 10. STREAM ERROR
        // ──────────────────────────────────────────────────────────
        stream.on('error', (err) => {
            console.error("❌ AI Stream Error:", err);

            res.write(`data: ${JSON.stringify({
                error: 'AI tạm thời không khả dụng. Vui lòng thử lại sau.',
                done: true
            })}\n\n`);

            res.end();
        });

    } catch (err) {
        console.error("❌ Chat Controller Error:", err.message || err);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: err.message || 'Lỗi server khi xử lý chat.',
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            });
        } else {
            try {
                res.write(`data: ${JSON.stringify({
                    error: err.message || 'Lỗi server',
                    done: true
                })}\n\n`);
            } catch (writeErr) { }
            res.end();
        }
    }
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * GET CHAT HISTORY
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.getHistory = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies?.chat_session_id;

    if (!userId && !sessionId) {
        return res.json({ success: true, history: [] });
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT id, role, content, intent, created_at 
             FROM chat_history 
             WHERE (user_id = ? OR session_id = ?)
             ORDER BY created_at ASC
             LIMIT 100`,
            [userId, sessionId]
        );

        res.json({
            success: true,
            history: rows.map(row => ({
                id: row.id,
                role: row.role,
                content: row.content,
                intent: row.intent,
                timestamp: row.created_at
            }))
        });
    } catch (err) {
        console.error("❌ Get History Error:", err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải lịch sử chat.'
        });
    }
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CLEAR CHAT HISTORY
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.clearHistory = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies?.chat_session_id;

    if (!userId && !sessionId) {
        return res.json({
            success: true,
            message: 'Không có lịch sử để xóa.'
        });
    }

    try {
        const [result] = await db.promise().query(
            `DELETE FROM chat_history 
             WHERE user_id = ? OR session_id = ?`,
            [userId, sessionId]
        );

        res.json({
            success: true,
            message: `Đã xóa ${result.affectedRows} tin nhắn.`
        });
    } catch (err) {
        console.error("❌ Clear History Error:", err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa lịch sử chat.'
        });
    }
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * GET QUICK ACTIONS
 * ═══════════════════════════════════════════════════════════════════════
 */
exports.getQuickActions = (req, res) => {
    const quickActions = [
        {
            id: 'trending',
            icon: '🔥',
            label: 'Phim đang hot',
            prompt: 'Cho tôi xem phim đang hot nhất'
        },
        {
            id: 'new',
            icon: '🆕',
            label: 'Phim mới',
            prompt: 'Phim mới cập nhật gần đây'
        },
        {
            id: 'vip',
            icon: '👑',
            label: 'Gói VIP',
            prompt: 'Cho tôi biết về các gói VIP'
        },
        {
            id: 'recommend',
            icon: '🎬',
            label: 'Gợi ý phim',
            prompt: 'Gợi ý phim hay để xem'
        },
        {
            id: 'action',
            icon: '💥',
            label: 'Phim hành động',
            prompt: 'Tìm phim hành động'
        }
    ];

    res.json({ success: true, actions: quickActions });
};