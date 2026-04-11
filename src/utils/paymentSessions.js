/**
 * In-memory payment sessions store
 * Sessions expire after 5 minutes (300 seconds)
 */

const sessions = new Map(); // key: randomCode (4-char), value: session object

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

exports.createSession = (userId, username, randomCode, amount) => {
    const now = Date.now();
    const session = {
        userId,
        username,
        randomCode,
        amount,
        status: 'pending', // pending | completed | expired
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
        expiresAtMs: now + SESSION_TTL_MS,
    };
    sessions.set(randomCode, session);
    return session;
};

exports.getSession = (randomCode) => {
    const session = sessions.get(randomCode);
    if (!session) return null;

    // Auto-expire
    if (Date.now() > session.expiresAtMs && session.status === 'pending') {
        session.status = 'expired';
        sessions.set(randomCode, session);
    }
    return session;
};

exports.completeSession = (randomCode) => {
    const session = sessions.get(randomCode);
    if (session) {
        session.status = 'completed';
        sessions.set(randomCode, session);
    }
    return session;
};

exports.getAllSessions = (page = 1, limit = 20, statusFilter = 'all') => {
    const all = Array.from(sessions.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Auto-expire and count statuses
    const counts = { all: all.length, completed: 0, pending: 0, expired: 0 };
    
    all.forEach(s => {
        if (s.status === 'pending' && Date.now() > s.expiresAtMs) {
            s.status = 'expired';
        }
        if (counts[s.status] !== undefined) {
            counts[s.status]++;
        }
    });

    // Filter
    const filtered = statusFilter === 'all' 
        ? all 
        : all.filter(s => s.status === statusFilter);

    // Paginate
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
        sessions: paginated,
        pagination: {
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit)
        },
        counts
    };
};

// Clean up very old sessions (>1 hour) to avoid memory leaks
exports.cleanOldSessions = () => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    for (const [key, session] of sessions.entries()) {
        if (now - new Date(session.createdAt).getTime() > ONE_HOUR) {
            sessions.delete(key);
        }
    }
};
