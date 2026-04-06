const db = require('../db');

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SERVICE: CONTEXT BUILDER - Hoàn chỉnh
 * ═══════════════════════════════════════════════════════════════════════
 */

const INTENT_KEYWORDS = {
    MOVIE_SEARCH: ['phim', 'tìm', 'tìm kiếm', 'search', 'xem phim', 'có phim', 'phim nào', 'cho tôi phim', 'movie'],
    MOVIE_HOT: ['hot', 'trending', 'nổi bật', 'phổ biến', 'nhiều người xem', 'đánh giá cao', 'hay nhất', 'top', 'phim hay'],
    MOVIE_NEW: ['mới', 'mới nhất', 'vừa ra', 'cập nhật', 'phim mới', 'release', 'hôm nay', 'gần đây'],
    VIP_INFO: ['vip', 'gói', 'giá', 'premium', 'membership', 'quyền lợi vip', 'tìm hiểu vip'],
    VIP_CHECK: ['vip của tôi', 'tài khoản', 'check vip', 'kiểm tra', 'đã vip', 'lên vip', 'còn hạn', 'hết hạn'],
    VIP_BUY: ['mua vip', 'đăng ký vip', 'nâng cấp vip', 'nâng vip', 'thanh toán', 'muốn vip', 'upgrade', 'mua gói'],
    USER_INFO: ['tôi là ai', 'thông tin tôi', 'tài khoản của tôi', 'profile', 'hồ sơ', 'thông tin tài khoản'],
    GENRE: ['hành động', 'tình cảm', 'kinh dị', 'hài', 'phiêu lưu', 'khoa học', 'anime', 'hoạt hình', 'comedy', 'horror', 'romance', 'animation', 'sci-fi', 'đánh nhau', 'chiến đấu', 'võ thuật'],
    COUNTRY: ['việt nam', 'hàn quốc', 'trung quốc', 'nhật bản', 'mỹ', 'usa', 'japan', 'korea', 'china', 'vietnam'],
    GREETING: ['chào', 'hello', 'hi', 'xin chào', 'hey']
};

/**
 * Main function
 */
exports.getRelevantContext = async (query, userId = null) => {
    let contextParts = [];
    const lowerQuery = query.toLowerCase().trim();

    console.log(`\n📊 [ContextService] Query: "${query}", UserId: ${userId || 'Guest'}\n`);

    try {
        // ──────────────────────────────────────────────────────────────
        // 0. LUÔN LẤY THÔNG TIN USER NẾU ĐÃ LOGIN
        // ──────────────────────────────────────────────────────────────
        let userInfo = null;
        if (userId) {
            userInfo = await getUserInfo(userId);
            if (userInfo) {
                contextParts.push(userInfo.context);
            }
        }

        // ──────────────────────────────────────────────────────────────
        // 1. CHÀO HỎI
        // ──────────────────────────────────────────────────────────────
        if (containsKeywords(lowerQuery, INTENT_KEYWORDS.GREETING) && lowerQuery.length < 20) {
            contextParts.push(`╔══════════════════════════════════════════╗
║              CHÀO HỎI                   ║
╚══════════════════════════════════════════╝
User đang chào hỏi.
→ Chào lại thân thiện ${userInfo ? `và gọi tên: "${userInfo.name}"` : ''}
→ Giới thiệu bạn có thể giúp: tìm phim, VIP, kiểm tra tài khoản`);
        }

        // ──────────────────────────────────────────────────────────────
        // 2. USER HỎI VỀ BẢN THÂN
        // ──────────────────────────────────────────────────────────────
        if (containsKeywords(lowerQuery, INTENT_KEYWORDS.USER_INFO) ||
            containsKeywords(lowerQuery, INTENT_KEYWORDS.VIP_CHECK)) {
            if (!userId) {
                contextParts.push(`╔══════════════════════════════════════════╗
║         USER CHƯA ĐĂNG NHẬP              ║
╚══════════════════════════════════════════╝
→ Nói: "Bạn chưa đăng nhập. Vui lòng đăng nhập để tôi có thể xem thông tin tài khoản của bạn nhé! 😊"`);
            }
        }

        // ──────────────────────────────────────────────────────────────
        // 3. VIP - MUA / NÂNG CẤP
        // ──────────────────────────────────────────────────────────────
        if (containsKeywords(lowerQuery, INTENT_KEYWORDS.VIP_BUY)) {
            const vipBuyContext = await getVipPurchaseContext(userId, userInfo);
            if (vipBuyContext) contextParts.push(vipBuyContext);
        }

        // ──────────────────────────────────────────────────────────────
        // 4. VIP INFO
        // ──────────────────────────────────────────────────────────────
        if (containsKeywords(lowerQuery, INTENT_KEYWORDS.VIP_INFO)) {
            const vipContext = await getVipContext();
            if (vipContext) contextParts.push(vipContext);
        }

        // ──────────────────────────────────────────────────────────────
        // 5. PHIM HOT (rating cao)
        // ──────────────────────────────────────────────────────────────
        if (containsKeywords(lowerQuery, INTENT_KEYWORDS.MOVIE_HOT)) {
            console.log(`🔥 [ContextService] Fetching HOT movies...`);
            const hotMovies = await getHotMovies();
            if (hotMovies) contextParts.push(hotMovies);
        }

        // ──────────────────────────────────────────────────────────────
        // 6. PHIM MỚI (mới thêm vào)
        // ──────────────────────────────────────────────────────────────
        else if (containsKeywords(lowerQuery, INTENT_KEYWORDS.MOVIE_NEW)) {
            console.log(`🆕 [ContextService] Fetching NEW movies...`);
            const newMovies = await getNewMovies();
            if (newMovies) contextParts.push(newMovies);
        }

        // ──────────────────────────────────────────────────────────────
        // 7. TÌM PHIM THEO THỂ LOẠI / TÊN
        // ──────────────────────────────────────────────────────────────
        else if (containsKeywords(lowerQuery, [
            ...INTENT_KEYWORDS.MOVIE_SEARCH,
            ...INTENT_KEYWORDS.GENRE,
            ...INTENT_KEYWORDS.COUNTRY
        ])) {
            console.log(`🎬 [ContextService] Fetching movies by search...`);
            const moviesContext = await getMoviesContext(lowerQuery);
            if (moviesContext) {
                contextParts.push(moviesContext);
            } else {
                const keyword = extractSearchKeyword(lowerQuery);
                contextParts.push(`╔══════════════════════════════════════════╗
║       KHÔNG TÌM THẤY PHIM               ║
╚══════════════════════════════════════════╝
Không tìm thấy phim "${keyword || query}".
→ Nói: "Xin lỗi, Cinema New hiện chưa có phim '${keyword || 'này'}'. Bạn có thể thử: Hành động, Kinh dị, Tình cảm, Hài... 😊"`);
            }
        }

        // ──────────────────────────────────────────────────────────────
        // 8. FALLBACK
        // ──────────────────────────────────────────────────────────────
        if (contextParts.length === 0 || (contextParts.length === 1 && userInfo)) {
            contextParts.push(`╔══════════════════════════════════════════╗
║         TRẢ LỜI CHUNG                   ║
╚══════════════════════════════════════════╝
User nói: "${query}"

→ Nếu không hiểu, nói: "Tôi có thể giúp bạn:
   • 🎬 Tìm phim (VD: phim hành động)
   • 🔥 Phim hot / phim mới
   • 👑 Thông tin VIP
   Bạn cần gì nhé? 😊"`);
        }

        return contextParts.join('\n\n');

    } catch (err) {
        console.error("❌ [ContextService] Error:", err);
        return `❌ LỖI: ${err.message}`;
    }
};

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

function containsKeywords(query, keywords) {
    return keywords.some(keyword => query.includes(keyword.toLowerCase()));
}

function extractSearchKeyword(query) {
    const stopWords = ['tìm', 'phim', 'cho', 'tôi', 'xem', 'có', 'về', 'gợi', 'ý', 'nên', 'hay', 'không', 'à', 'nhé', 'kiếm', 'thể', 'loại', 'muốn', 'cần'];
    return query.toLowerCase().split(' ').filter(w => w.length > 1 && !stopWords.includes(w)).join(' ');
}

/**
 * LẤY THÔNG TIN USER
 */
async function getUserInfo(userId) {
    try {
        const [rows] = await db.promise().query(`
            SELECT id, username, email, is_vip, vip_expired_at, create_at as joined_date
            FROM users WHERE id = ?
        `, [userId]);

        if (rows.length === 0) return null;

        const user = rows[0];
        const now = new Date();
        const expiryDate = user.vip_expired_at ? new Date(user.vip_expired_at) : null;
        const isVipActive = user.is_vip === 1 && expiryDate && expiryDate > now;
        const daysLeft = expiryDate && expiryDate > now ? Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)) : 0;

        return {
            name: user.username,
            context: `╔══════════════════════════════════════════╗
║       THÔNG TIN KHÁCH HÀNG              ║
╚══════════════════════════════════════════╝
👤 Tên: ${user.username}
📧 Email: ${user.email}
👑 VIP: ${isVipActive ? `✅ ĐANG HOẠT ĐỘNG (còn ${daysLeft} ngày)` : '❌ CHƯA CÓ / HẾT HẠN'}
${isVipActive ? `📅 Hạn: ${expiryDate.toLocaleDateString('vi-VN')}` : ''}

⭐ Xưng hô: gọi tên "${user.username}"
⭐ ${isVipActive ? 'Cảm ơn đã ủng hộ VIP' : 'Có thể gợi ý nâng cấp VIP'}`
        };
    } catch (err) {
        console.error("❌ [getUserInfo] Error:", err);
        return null;
    }
}

/**
 * CONTEXT MUA VIP - LINK: /vip
 */
async function getVipPurchaseContext(userId, userInfo) {
    try {
        const [packages] = await db.promise().query(`SELECT id, title, price, duration FROM vip ORDER BY price ASC`);
        if (packages.length === 0) return null;

        let statusText = !userId
            ? `⚠️ KHÁCH CHƯA ĐĂNG NHẬP → Yêu cầu đăng nhập trước`
            : `✅ KHÁCH ĐÃ ĐĂNG NHẬP → Có thể mua VIP`;

        return `╔══════════════════════════════════════════╗
║         HƯỚNG DẪN MUA VIP               ║
╚══════════════════════════════════════════╝
${statusText}

💳 GÓI VIP:
${packages.map((p, i) => `${i + 1}. 👑 ${p.title} - ${parseFloat(p.price).toLocaleString('vi-VN')} VNĐ/${p.duration} ngày`).join('\n')}

🔗 LINK NÂNG CẤP: /vip (ĐÚNG LINK NÀY)

→ Hướng dẫn: "Bạn có thể nâng cấp VIP tại đây: [Nâng cấp VIP](/vip) 👑"`;
    } catch (err) {
        return null;
    }
}

/**
 * THÔNG TIN GÓI VIP - LINK: /vip
 */
async function getVipContext() {
    try {
        const [rows] = await db.promise().query(`SELECT id, title, price, duration FROM vip ORDER BY price ASC`);
        if (rows.length === 0) return null;

        return `╔══════════════════════════════════════════╗
║          THÔNG TIN GÓI VIP              ║
╚══════════════════════════════════════════╝
${rows.map((v, i) => `👑 GÓI ${i + 1}: ${v.title}
💰 Giá: ${parseFloat(v.price).toLocaleString('vi-VN')} VNĐ
⏱️ Thời hạn: ${v.duration} ngày
✨ Quyền lợi: Xem phim VIP, không quảng cáo, HD/4K, offline`).join('\n\n')}

🔗 LINK: /vip
→ Hướng dẫn: "Nâng cấp tại đây: [Nâng cấp VIP](/vip) 👑"`;
    } catch (err) {
        return null;
    }
}

/**
 * 🔥 PHIM HOT - ORDER BY RATING DESC
 */
async function getHotMovies() {
    try {
        const [rows] = await db.promise().query(`
            SELECT m.id, m.title, m.release_date, m.avatar_url, m.required_vip_level,
                   GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres,
                   IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            LEFT JOIN ratings r ON m.id = r.movie_id
            GROUP BY m.id
            HAVING rating > 0
            ORDER BY rating DESC, m.created_at DESC
            LIMIT 8
        `);

        if (rows.length === 0) return null;

        const movieCards = rows.map(m => ({
            id: m.id,
            title: m.title,
            poster: m.avatar_url || '',
            rating: m.rating || 0,
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            genre: m.genres || 'N/A',
            is_vip: m.required_vip_level > 0
        }));

        return `╔══════════════════════════════════════════╗
║       🔥 PHIM HOT (Rating cao)          ║
╚══════════════════════════════════════════╝
${rows.map((m, i) => `${i + 1}. ${m.title} - ⭐${m.rating}`).join('\n')}

✨ FORMAT: Dùng \`\`\`moviecard cho từng phim
⚠️ LINK PHIM: /movie/{ID} (VD: /movie/${rows[0].id})

📋 JSON:
${JSON.stringify(movieCards, null, 2)}`;
    } catch (err) {
        return null;
    }
}

/**
 * 🆕 PHIM MỚI - ORDER BY created_at DESC
 */
async function getNewMovies() {
    try {
        const [rows] = await db.promise().query(`
            SELECT m.id, m.title, m.release_date, m.avatar_url, m.required_vip_level, m.created_at,
                   GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres,
                   IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            LEFT JOIN ratings r ON m.id = r.movie_id
            GROUP BY m.id
            ORDER BY m.created_at DESC
            LIMIT 8
        `);

        if (rows.length === 0) return null;

        const movieCards = rows.map(m => ({
            id: m.id,
            title: m.title,
            poster: m.avatar_url || '',
            rating: m.rating || 0,
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            genre: m.genres || 'N/A',
            is_vip: m.required_vip_level > 0
        }));

        return `╔══════════════════════════════════════════╗
║       🆕 PHIM MỚI (Mới thêm)            ║
╚══════════════════════════════════════════╝
${rows.map((m, i) => `${i + 1}. ${m.title} - ${new Date(m.created_at).toLocaleDateString('vi-VN')}`).join('\n')}

✨ FORMAT: Dùng \`\`\`moviecard cho từng phim
⚠️ LINK PHIM: /movie/{ID}

📋 JSON:
${JSON.stringify(movieCards, null, 2)}`;
    } catch (err) {
        return null;
    }
}

/**
 * TÌM PHIM THEO THỂ LOẠI / TÊN
 */
async function getMoviesContext(query) {
    try {
        let sql = `
            SELECT m.id, m.title, m.release_date, m.avatar_url, m.required_vip_level,
                   GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres,
                   IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            LEFT JOIN ratings r ON m.id = r.movie_id
            WHERE 1=1
        `;
        const params = [];

        // Genre mapping
        const genreMap = {
            'hành động': 'Hành Động', 'action': 'Hành Động', 'đánh nhau': 'Hành Động', 'chiến đấu': 'Hành Động',
            'comedy': 'Comedy', 'hài': 'Comedy',
            'horror': 'Horror', 'kinh dị': 'Horror',
            'romance': 'Romance', 'tình cảm': 'Romance',
            'animation': 'Animation', 'hoạt hình': 'Animation',
            'sci-fi': 'Sci-Fi', 'khoa học': 'Sci-Fi'
        };

        let genreFound = false;
        for (const [keyword, genreName] of Object.entries(genreMap)) {
            if (query.includes(keyword)) {
                sql += " AND g.name LIKE ?";
                params.push(`%${genreName}%`);
                genreFound = true;
                break;
            }
        }

        const searchKeyword = extractSearchKeyword(query);
        if (searchKeyword && searchKeyword.length > 1 && !genreFound) {
            sql += " AND (m.title LIKE ? OR m.description LIKE ?)";
            params.push(`%${searchKeyword}%`, `%${searchKeyword}%`);
        }

        sql += " GROUP BY m.id ORDER BY rating DESC, m.created_at DESC LIMIT 8";

        const [rows] = await db.promise().query(sql, params);
        if (rows.length === 0) return null;

        const movieCards = rows.map(m => ({
            id: m.id,
            title: m.title,
            poster: m.avatar_url || '',
            rating: m.rating || 0,
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            genre: m.genres || 'N/A',
            is_vip: m.required_vip_level > 0
        }));

        return `╔══════════════════════════════════════════╗
║       TÌM THẤY ${rows.length} PHIM                  ║
╚══════════════════════════════════════════╝
${rows.map((m, i) => `${i + 1}. ${m.title} - ⭐${m.rating} - ${m.required_vip_level > 0 ? 'VIP' : 'Free'}`).join('\n')}

✨ FORMAT: \`\`\`moviecard cho từng phim
⚠️ LINK: /movie/{ID} (VD: /movie/${rows[0].id})

📋 JSON:
${JSON.stringify(movieCards, null, 2)}`;
    } catch (err) {
        return null;
    }
}

module.exports = { getRelevantContext: exports.getRelevantContext };