const db = require('../db');

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SERVICE: CONTEXT BUILDER - Version 2 (Intelligent Intent-based)
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Main function - Được gọi từ chatController sau khi có intent
 */
exports.getRelevantContext = async (intentObj, userId = null) => {
    let contextParts = [];
    const { intent, subIntent, entities } = intentObj;

    console.log(`\n📊 [ContextService] Layer 2 Context Processing: Intent=${intent}, SubIntent=${subIntent}\n`);

    try {
        // ──────────────────────────────────────────────────────────────
        // 0. LUÔN LẤY THÔNG TIN USER NẾU ĐÃ LOGIN
        // ──────────────────────────────────────────────────────────────
        let userInfo = null;
        if (userId) {
            userInfo = await getUserInfo(userId);
            if (userInfo) contextParts.push(userInfo.context);
        }

        // ──────────────────────────────────────────────────────────────
        // 1. ROUTING DỰA TRÊN INTENT
        // ──────────────────────────────────────────────────────────────
        switch (intent) {
            case 'MOVIE':
                await handleMovieIntent(subIntent, entities, contextParts);
                break;
            case 'VIP':
                await handleVipIntent(subIntent, userId, userInfo, contextParts);
                break;
            case 'ACCOUNT':
                await handleAccountIntent(subIntent, userId, contextParts);
                break;
            case 'GENERAL':
            default:
                contextParts.push(getGeneralFallbackContext());
                break;
        }

        // Nếu là intent MOVIE nhưng không tìm thấy phim nào
        if (intent === 'MOVIE' && !contextParts.some(p => p.includes('ID:'))) {
            contextParts.push(`[HỆ THỐNG: KHÔNG TÌM THẤY PHIM PHÙ HỢP TRONG DATABASE]
- Hiện tại kho phim không có phim nào khớp với yêu cầu của user. 
- YÊU CẦU: Thành thật báo với user là không tìm thấy, gợi ý user thử tìm theo từ khóa khác. TUYỆT ĐỐI KHÔNG BỊA RA PHIM.`);
        }

        // Nếu context vẫn trống (do error hoặc subIntent lạ), fallback về thông tin chung
        if (contextParts.length === 0 || (contextParts.length === 1 && userInfo)) {
            contextParts.push(getGeneralFallbackContext(!!userId));
        }

        return contextParts.join('\n\n');

    } catch (err) {
        console.error("❌ [ContextService] Error:", err);
        return `❌ LỖI TRUY VẤN CONTEXT: ${err.message}`;
    }
};

// ═══════════════════════════════════════════════════════════════════════
// MOVIE HANDLERS
// ═══════════════════════════════════════════════════════════════════════

async function handleMovieIntent(subIntent, entities, contextParts) {
    const { movieName, genre, mood, movieId } = entities;

    switch (subIntent) {
        case 'search_by_name':
        case 'movie_info':
            const detail = await exports.getMovieDetail(movieName);
            if (detail) contextParts.push(detail);
            break;
        case 'search_by_genre':
            const genreMovies = await getMoviesByGenre(genre);
            if (genreMovies) contextParts.push(genreMovies);
            break;
        case 'search_by_mood':
            const moodMovies = await exports.getMoviesByMood(mood);
            if (moodMovies) contextParts.push(moodMovies);
            break;
        case 'similar':
            const similar = await exports.getSimilarMovies(movieId);
            if (similar) contextParts.push(similar);
            break;
        case 'hot':
            const hot = await getHotMovies();
            if (hot) contextParts.push(hot);
            break;
        case 'new':
            const newM = await getNewMovies();
            if (newM) contextParts.push(newM);
            break;
        default:
            // Fallback gợi ý chung về phim
            const top = await getHotMovies();
            if (top) contextParts.push(top);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// VIP HANDLERS
// ═══════════════════════════════════════════════════════════════════════

async function handleVipIntent(subIntent, userId, userInfo, contextParts) {
    switch (subIntent) {
        case 'status_check':
            if (!userId) contextParts.push(getAuthRequiredContext("kiểm tra trạng thái VIP"));
            // userInfo đã có status_check trong getUserInfo()
            break;
        case 'pricing':
        case 'buy_guide':
            const buy = await getVipPurchaseContext(userId, userInfo);
            if (buy) contextParts.push(buy);
            break;
        case 'access_denied':
            contextParts.push(`╔══════════════════════════════════════════╗
║     LÝ DO KHÔNG XEM ĐƯỢC PHIM          ║
╚══════════════════════════════════════════╝
- User đang hỏi tại sao không xem được phim.
- Một số phim yêu cầu tài khoản VIP. 
- Hãy kiểm tra xem user đã là VIP chưa (nhìn info trên).
- Nếu chưa, hãy nhiệt tình hướng dẫn nâng cấp VIP tại /vip`);
            break;
        default:
            const vip = await getVipContext();
            if (vip) contextParts.push(vip);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ACCOUNT HANDLERS
// ═══════════════════════════════════════════════════════════════════════

async function handleAccountIntent(subIntent, userId, contextParts) {
    if (!userId) {
        contextParts.push(getAuthRequiredContext("truy cập thông tin tài khoản"));
        return;
    }

    switch (subIntent) {
        case 'watch_history':
            const history = await exports.getWatchHistory(userId);
            if (history) contextParts.push(history);
            break;
        case 'user_info':
            // getUserInfo đã lo phần này
            break;
        default:
            contextParts.push(`→ Hướng dẫn user quản lý profile tại trang cá nhân.`);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTED FEATURE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

/**
 * [NEW] LẤY LỊCH SỬ XEM PHIM (4 PHIM GẦN NHẤT)
 */
exports.getWatchHistory = async (userId, limit = 4) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT m.id, m.title, m.avatar_url, m.required_vip_level,
                   (SELECT IFNULL(ROUND(AVG(rating), 1), 0) FROM ratings WHERE movie_id = m.id) as rating,
                   h.updated_at
            FROM watch_history h
            JOIN movies m ON h.movie_id = m.id
            WHERE h.user_id = ?
            ORDER BY h.updated_at DESC
            LIMIT ?
        `, [userId, limit]);

        if (rows.length === 0) return `╔══════════════════════════════════════════╗
║          LỊCH SỬ XEM PHIM               ║
╚══════════════════════════════════════════╝
Bạn chưa xem bộ phim nào gần đây. Hãy bắt đầu khám phá kho phim của Cinema New nhé! 😊`;

        const baseContext = formatMovieContext("LỊCH SỬ XEM PHIM (GẦN NHẤT)", rows);
        
        // Thêm ghi chú riêng cho lịch sử
        return `${baseContext}
        
→ Hãy báo với user đây là những phim họ đã xem gần đây. Có thể dựa vào đây để gợi ý phim tương tự!`;
    } catch (err) {
        console.error("❌ [getWatchHistory] Error:", err);
        return null;
    }
};

/**
 * [NEW] TÌM PHIM THEO TÂM TRẠNG (Mood)
 */
exports.getMoviesByMood = async (mood) => {
    // [HEURISTIC] Map mood to Vietnamese genre in DB
    const moodMap = {
        'buồn': 'Tình cảm', 'thất tình': 'Tình cảm', 'cô đơn': 'Tình cảm',
        'vui': 'Hài hước', 'hài': 'Hài hước', 'hài hước': 'Hài hước',
        'chill': 'Hoạt hình', 'nhẹ nhàng': 'Hoạt hình',
        'sợ': 'Kinh dị', 'kinh dị': 'Kinh dị', 
        'căng thẳng': 'Hành động', 'hành động': 'Hành động',
        'hào hứng': 'Hành động', 'phiêu lưu': 'Phiêu lưu',
        'tâm lý': 'Tâm lý', 'sâu sắc': 'Tâm lý'
    };

    const targetGenre = moodMap[mood.toLowerCase()];
    if (targetGenre) {
        console.log(`🧠 [MoodMapping] ${mood} -> ${targetGenre}`);
        return await getMoviesByGenre(targetGenre);
    }

    // Fallback: Tìm trong description
    try {
        const [rows] = await db.promise().query(`
            SELECT m.id, m.title, m.avatar_url, m.required_vip_level,
                   IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
            FROM movies m
            LEFT JOIN ratings r ON m.id = r.movie_id
            WHERE m.description LIKE ? OR m.title LIKE ?
            GROUP BY m.id
            ORDER BY rating DESC LIMIT 5
        `, [`%${mood}%`, `%${mood}%`]);

        if (rows.length === 0) return null;

        return formatMovieContext(`PHIM PHÙ HỢP TÂM TRẠNG: ${mood}`, rows);
    } catch (err) {
        return null;
    }
};

/**
 * [NEW] TÌM PHIM TƯƠNG TỰ
 */
exports.getSimilarMovies = async (movieId) => {
    try {
        if (!movieId) return null;
        // B1: Lấy genre của phim hiện tại
        const [genres] = await db.promise().query(`SELECT genre_id FROM movie_genres WHERE movie_id = ?`, [movieId]);
        if (genres.length === 0) return null;

        const genreIds = genres.map(g => g.genre_id);

        // B2: Tìm phim cùng genre
        const [rows] = await db.promise().query(`
            SELECT m.id, m.title, m.avatar_url, m.required_vip_level,
                   IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
            FROM movies m
            JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN ratings r ON m.id = r.movie_id
            WHERE mg.genre_id IN (?) AND m.id != ?
            GROUP BY m.id
            ORDER BY rating DESC LIMIT 5
        `, [genreIds, movieId]);

        return formatMovieContext(`PHIM TƯƠNG TỰ`, rows);
    } catch (err) {
        return null;
    }
};

/**
 * [NEW] CHI TIẾT PHIM THEO TÊN
 */
exports.getMovieDetail = async (movieName) => {
    try {
        if (!movieName) return null;
        const [rows] = await db.promise().query(`
            SELECT m.id, m.title, m.description, m.release_date, m.avatar_url, m.required_vip_level,
                   GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres,
                   IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            LEFT JOIN ratings r ON m.id = r.movie_id
            WHERE m.title LIKE ?
            GROUP BY m.id
            LIMIT 1
        `, [`%${movieName}%`]);

        if (rows.length === 0) return null;

        const m = rows[0];
        const card = {
            id: m.id, title: m.title, poster: m.avatar_url, 
            rating: m.rating, year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            genre: m.genres, is_vip: m.required_vip_level > 0
        };

        return `╔══════════════════════════════════════════╗
║           CHI TIẾT PHIM                 ║
╚══════════════════════════════════════════╝
🎬 Phim: ${m.title}
⭐ Đánh giá: ${m.rating}/10
📂 Thể loại: ${m.genres}
📝 Mô tả: ${m.description}
👑 Yêu cầu: ${m.required_vip_level > 0 ? 'VIP' : 'Miễn phí'}

✨ FORMAT hiển thị: Dùng \`\`\`moviecard
\`\`\`moviecard
${JSON.stringify(card)}
\`\`\`
`;
    } catch (err) {
        return null;
    }
};

// ═══════════════════════════════════════════════════════════════════════
// INTERNAL HELPERS (Reuse from old version)
// ═══════════════════════════════════════════════════════════════════════

async function getUserInfo(userId) {
    try {
        const [rows] = await db.promise().query(`
            SELECT username, email, is_vip, vip_expired_at FROM users WHERE id = ?
        `, [userId]);
        if (rows.length === 0) return null;
        const u = rows[0];
        const isVip = u.is_vip === 1 && new Date(u.vip_expired_at) > new Date();
        return {
            name: u.username,
            context: `[TRẠNG THÁI: ĐÃ ĐĂNG NHẬP]
- Tên: ${u.username}
- Email: ${u.email}
- VIP: ${isVip ? '✅ CÓ (Hợp lệ)' : '❌ KHÔNG (Standard)'}`
        };
    } catch (e) { return null; }
}

async function getVipPurchaseContext() {
    try {
        const [rows] = await db.promise().query(`SELECT title, price, duration FROM vip`);
        return `[GÓI VIP] ${rows.map(r => `${r.title}: ${r.price.toLocaleString()}đ/${r.duration}n`).join(', ')}. 
→ Link nâng cấp: /vip 
→ YÊU CẦU: Hãy dùng cú pháp [CTA:Nâng cấp VIP ngay|/vip] ở cuối câu trả lời.`;
    } catch (e) { return null; }
}

async function getVipContext() { return await getVipPurchaseContext(); }

async function getHotMovies() {
    const [rows] = await db.promise().query(`
        SELECT m.id, m.title, m.avatar_url, m.required_vip_level,
               IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
        FROM movies m 
        LEFT JOIN ratings r ON m.id = r.movie_id 
        GROUP BY m.id 
        ORDER BY rating DESC LIMIT 5
    `);
    return formatMovieContext("PHIM HOT NHẤT", rows);
}

async function getNewMovies() {
    const [rows] = await db.promise().query(`
        SELECT id, title, avatar_url, required_vip_level, 
               (SELECT IFNULL(ROUND(AVG(rating), 1), 0) FROM ratings WHERE movie_id = movies.id) as rating
        FROM movies 
        ORDER BY created_at DESC LIMIT 5
    `);
    return formatMovieContext("PHIM MỚI CẬP NHẬT", rows);
}

async function getMoviesByGenre(genreName) {
    const [rows] = await db.promise().query(`
        SELECT m.id, m.title, m.avatar_url, m.required_vip_level,
               IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
        FROM movies m 
        JOIN movie_genres mg ON m.id = mg.movie_id 
        JOIN genres g ON mg.genre_id = g.id 
        LEFT JOIN ratings r ON m.id = r.movie_id
        WHERE g.name LIKE ? 
        GROUP BY m.id
        LIMIT 5`, [`%${genreName}%`]);
    return formatMovieContext(`PHIM THỂ LOẠI ${genreName}`, rows);
}

function formatMovieContext(title, movies) {
    const listDescription = movies.map((m, i) => `${i + 1}. ${m.title} (Rating: ${m.rating}, VIP: ${m.required_vip_level > 0 ? 'Có' : 'Không'})`).join('\n');
    
    // Tạo mảng các JSON moviecard để AI dễ copy-paste
    const cards = movies.map(m => ({
        id: m.id,
        title: m.title,
        poster: m.avatar_url,
        rating: m.rating,
        is_vip: m.required_vip_level > 0
    }));

    return `╔══════════════════════════════════════════╗
║ ${title.padEnd(38)} ║
╚══════════════════════════════════════════╝
${listDescription}

✨ CÁCH HIỂN THỊ: Cho mỗi phim trên, hãy tạo một block \`\`\`moviecard CHỈ chứa JSON sau:
${cards.map(c => `\`\`\`moviecard\n${JSON.stringify(c)}\n\`\`\``).join('\n')}`;
}

function getGeneralFallbackContext(isLoggedIn) {
    let context = `→ Cinema New là rạp phim trực tuyến hàng đầu, hỗ trợ xem phim, mua VIP và quản lý tài khoản.`;
    if (!isLoggedIn) {
        context += `\n→ LƯU Ý: User CHƯA đăng nhập. Hãy lịch sự yêu cầu user đăng nhập tại /login để xem được lịch sử và mua VIP.`;
    }
    return context;
}

function getAuthRequiredContext(action) {
    return `╔══════════════════════════════════════════╗
║       YÊU CẦU ĐĂNG NHẬP                  ║
╚══════════════════════════════════════════╝
- User cần đăng nhập để ${action}.
- Hãy lịch sự yêu cầu user đăng nhập tại đây: [Đăng nhập](/login)
- TRẢ VỀ FLAG: [NEED_LOGIN] trong câu trả lời nếu thấy phù hợp.`;
}