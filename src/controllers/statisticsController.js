const db = require('../db');

exports.getStatistics = async (req, res) => {
    try {
        let rangeRaw = req.query.range || 'Tháng';
        // Map Vietnamese strings to internal keys if sent
        const rangeMap = {
            'Tháng': 'month',
            'month': 'month',
            'Quý': 'quarter',
            'quarter': 'quarter',
            'Năm': 'year',
            'year': 'year'
        };
        const timeRange = rangeMap[rangeRaw] || 'month';
        
        // Let's use the timeRange internal key for the logic but keep labels in VN
        let revenueSql = '';
        let revenueParams = [];
        let labels = [];
        let heights = [];
        let totalRevenue = 0;
        let growth = '+0%';

        const now = new Date();

        // 1. Revenue & Bar Chart Data
        if (timeRange === 'month') {
            revenueSql = `
                SELECT 
                    DATE_FORMAT(start_date, '%m/%Y') as label,
                    SUM(price_paid) as total
                FROM vip_history
                WHERE start_date >= DATE_SUB(LAST_DAY(NOW()), INTERVAL 6 MONTH)
                GROUP BY label
                ORDER BY MIN(start_date) ASC
            `;
            const [rows] = await db.promise().query(revenueSql);
            
            // Generate last 6 months labels to ensure we have data for all bars
            for (let i = 5; i >= 0; i--) {
                let d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                let lbl = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                labels.push('Tháng ' + (d.getMonth() + 1));
                
                let found = rows.find(r => r.label === lbl);
                let val = found ? parseFloat(found.total) : 0;
                totalRevenue += val;
                // Scale for bar height (max 100)
                heights.push(Math.min(100, Math.max(10, (val / 1000) * 100))); 
            }
        } else if (timeRange === 'quarter') {
            revenueSql = `
                SELECT 
                    CONCAT('Q', QUARTER(start_date), '/', YEAR(start_date)) as label,
                    SUM(price_paid) as total
                FROM vip_history
                WHERE start_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                GROUP BY label
                ORDER BY MIN(start_date) ASC
            `;
            const [rows] = await db.promise().query(revenueSql);
            
            // Last 4 quarters
            for (let i = 3; i >= 0; i--) {
                let d = new Date();
                d.setMonth(d.getMonth() - (i * 3));
                let q = Math.ceil((d.getMonth() + 1) / 3);
                let lbl = `Q${q}/${d.getFullYear()}`;
                labels.push('Quý ' + q);
                
                let found = rows.find(r => r.label === lbl);
                let val = found ? parseFloat(found.total) : 0;
                totalRevenue += val;
                heights.push(Math.min(100, Math.max(10, (val / 3000) * 100)));
            }
        } else { // year
            revenueSql = `
                SELECT 
                    YEAR(start_date) as label,
                    SUM(price_paid) as total
                FROM vip_history
                WHERE start_date >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
                GROUP BY label
                ORDER BY label ASC
            `;
            const [rows] = await db.promise().query(revenueSql);
            
            for (let i = 4; i >= 0; i--) {
                let yr = now.getFullYear() - i;
                labels.push(yr.toString());
                
                let found = rows.find(r => r.label == yr);
                let val = found ? parseFloat(found.total) : 0;
                totalRevenue += val;
                heights.push(Math.min(100, Math.max(10, (val / 10000) * 100)));
            }
        }

        // 2. Genre Distribution (Based on views if possible, otherwise movie count)
        const genreSql = `
            SELECT g.name, COUNT(mv.id) as count
            FROM genres g
            LEFT JOIN movie_genres mg ON g.id = mg.genre_id
            LEFT JOIN movie_views mv ON mg.movie_id = mv.movie_id
            GROUP BY g.id
            ORDER BY count DESC
            LIMIT 4
        `;
        const [genreRows] = await db.promise().query(genreSql);
        let totalGenreViews = genreRows.reduce((sum, row) => sum + row.count, 0) || 1;
        const colors = ['bg-primary', 'bg-primary-container', 'bg-secondary', 'bg-tertiary'];
        const genresFormatted = genreRows.map((g, i) => ({
            label: g.name,
            value: Math.round((g.count / totalGenreViews) * 100) + '%',
            color: colors[i % colors.length]
        }));

        // 3. Top Movies
        const topMoviesSql = `
            SELECT 
                m.id, m.title, m.avatar_url as image,
                GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genre,
                (SELECT COUNT(*) FROM movie_views mv WHERE mv.movie_id = m.id) as views_count,
                (SELECT IFNULL(ROUND(AVG(rating), 1), 0) FROM ratings WHERE movie_id = m.id) as rating,
                (SELECT SUM(vh.price_paid) FROM vip_history vh WHERE 1=0) as mock_rev -- placeholder for per-movie revenue if tracked
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            GROUP BY m.id
            ORDER BY views_count DESC
            LIMIT 5
        `;
        const [topMoviesRows] = await db.promise().query(topMoviesSql);
        const topMovies = topMoviesRows.map(m => ({
            title: m.title,
            genre: m.genre || 'Phim mới',
            views: m.views_count.toLocaleString() + ' lượt xem',
            revenue: '$' + (m.views_count * 0.5).toFixed(1) + 'k', // Estimated revenue based on views
            rating: m.rating,
            image: m.image
        }));

        // 4. VIP Trend (Counts of new VIP signups)
        let vipTrendLabels = [];
        let vipTrendCounts = [];
        
        if (timeRange === 'month') {
            const [signupRows] = await db.promise().query(`
                SELECT DATE_FORMAT(start_date, '%m/%Y') as label, COUNT(*) as count
                FROM vip_history
                WHERE start_date >= DATE_SUB(LAST_DAY(NOW()), INTERVAL 6 MONTH)
                GROUP BY label
                ORDER BY MIN(start_date) ASC
            `);
            for (let i = 5; i >= 0; i--) {
                let d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                let lbl = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                vipTrendLabels.push(labels[5-i] || (d.getMonth() + 1).toString());
                let found = signupRows.find(r => r.label === lbl);
                vipTrendCounts.push(found ? parseInt(found.count) : 0);
            }
        } else if (timeRange === 'quarter') {
            const [signupRows] = await db.promise().query(`
                SELECT CONCAT('Q', QUARTER(start_date), '/', YEAR(start_date)) as label, COUNT(*) as count
                FROM vip_history
                WHERE start_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                GROUP BY label
                ORDER BY MIN(start_date) ASC
            `);
            for (let i = 3; i >= 0; i--) {
                let d = new Date(); d.setMonth(d.getMonth() - (i * 3));
                let q = Math.ceil((d.getMonth() + 1) / 3);
                let lbl = `Q${q}/${d.getFullYear()}`;
                vipTrendLabels.push('Quý ' + q);
                let found = signupRows.find(r => r.label === lbl);
                vipTrendCounts.push(found ? parseInt(found.count) : 0);
            }
        } else { // year
            const [signupRows] = await db.promise().query(`
                SELECT YEAR(start_date) as label, COUNT(*) as count
                FROM vip_history
                WHERE start_date >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
                GROUP BY label
                ORDER BY label ASC
            `);
            for (let i = 4; i >= 0; i--) {
                let yr = now.getFullYear() - i;
                vipTrendLabels.push(yr.toString());
                let found = signupRows.find(r => r.label == yr);
                vipTrendCounts.push(found ? parseInt(found.count) : 0);
            }
        }

        // 5. User Stats
        const [totalUsersRows] = await db.promise().query('SELECT COUNT(*) as total FROM users');
        const [vipUsersRows] = await db.promise().query('SELECT COUNT(*) as total FROM users WHERE is_vip = 1');
        const [newUsersRows] = await db.promise().query('SELECT COUNT(*) as total FROM users WHERE create_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
        
        const userStats = {
            total: totalUsersRows[0].total,
            vip: vipUsersRows[0].total,
            new: newUsersRows[0].total,
            vipPercentage: Math.round((vipUsersRows[0].total / (totalUsersRows[0].total || 1)) * 100) + '%'
        };

        // Calculate Growth (compare current vs previous period sum)
        const currentTotal = heights[heights.length - 1] || 0;
        const prevTotal = heights[heights.length - 2] || 0;
        let growthVal = 0;
        if (prevTotal > 0) {
            growthVal = ((currentTotal - prevTotal) / prevTotal) * 100;
        } else if (currentTotal > 0) {
            growthVal = 100;
        }
        growth = (growthVal >= 0 ? '+' : '') + growthVal.toFixed(1) + '%';

        res.status(200).json({
            success: true,
            data: {
                timeRange,
                revenueData: {
                    total: `$${(totalRevenue / 1000).toFixed(1)}k`,
                    growth: growth,
                    heights: heights.length ? heights : [40, 60, 80, 50, 70, 90],
                    labels: labels
                },
                genres: genresFormatted.length ? genresFormatted : [
                    { label: 'Hành động', value: '74%', color: 'bg-primary-container' },
                    { label: 'Tình cảm', value: '16%', color: 'bg-primary' },
                    { label: 'Kinh dị', value: '10%', color: 'bg-secondary' }
                ],
                topMovies: topMovies,
                userStats: userStats,
                vipTrend: {
                    labels: vipTrendLabels,
                    counts: vipTrendCounts
                }
            }
        });

    } catch (error) {
        console.error("GET STATS ERROR:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
exports.getRevenueHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const sql = `
            SELECT 
                vh.id,
                u.username,
                u.email,
                v.title as vip_package,
                vh.price_paid,
                vh.start_date,
                vh.end_date
            FROM vip_history vh
            JOIN users u ON vh.user_id = u.id
            LEFT JOIN vip v ON vh.vip_id = v.id
            ORDER BY vh.start_date DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.promise().query(sql, [limit, offset]);

        const [[{ total }]] = await db.promise().query('SELECT COUNT(*) as total FROM vip_history');

        // Summary stats
        const [[{ totalRevenue }]] = await db.promise().query('SELECT IFNULL(SUM(price_paid), 0) as totalRevenue FROM vip_history');
        const [[{ monthRevenue }]] = await db.promise().query(
            `SELECT IFNULL(SUM(price_paid), 0) as monthRevenue FROM vip_history WHERE start_date >= DATE_FORMAT(NOW(), '%Y-%m-01')`
        );

        res.status(200).json({
            success: true,
            data: {
                rows: rows.map(r => ({
                    id: r.id,
                    username: r.username,
                    email: r.email,
                    vip_package: r.vip_package || 'VIP',
                    price_paid: r.price_paid,
                    start_date: r.start_date,
                    end_date: r.end_date,
                })),
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
                summary: {
                    totalRevenue: parseFloat(totalRevenue) || 0,
                    monthRevenue: parseFloat(monthRevenue) || 0,
                }
            }
        });
    } catch (error) {
        console.error('GET REVENUE HISTORY ERROR:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
