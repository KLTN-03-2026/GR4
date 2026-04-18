const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser"); // ← THÊM MỚI

const app = express();
const db = require("./src/db");

// ═══════════════════════════════════════════════════════════════════════
// ROUTES IMPORT
// ═══════════════════════════════════════════════════════════════════════
const userRouter = require("./src/routes/userRouter");
const favoriteRouter = require("./src/routes/favoriteRouter");
const movieRouter = require("./src/routes/movieRouter");
const genreRouter = require("./src/routes/genreRouter");
const countrieRouter = require("./src/routes/countrieRouter");
const reviewRouter = require("./src/routes/reviewRouter");
const commentRouter = require("./src/routes/commentRouter");
const uploadRouter = require("./src/routes/uploadRouter");
const vipRouter = require("./src/routes/vipRouter");
const historyRouter = require("./src/routes/historyRouter");
const notificationRouter = require("./src/routes/notificationRouter");
const statisticsRouter = require("./src/routes/statisticsRouter");
const chatRouter = require("./src/routes/chatRouter");

require("dotenv").config();

// ═══════════════════════════════════════════════════════════════════════
// MIDDLEWARE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════

// CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://172.16.1.76:5173",
    "http://172.16.1.76:5174",
    "http://0.0.0.0:5173",
    "http://0.0.0.0:5174"
  ],
  credentials: true, // ← Quan trọng cho cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser - THÊM MỚI (cần cho session chat)
app.use(cookieParser());

// ═══════════════════════════════════════════════════════════════════════
// STATIC FILES
// ═══════════════════════════════════════════════════════════════════════
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/hls', express.static(path.join(__dirname, 'uploads/encoded')));
app.use('/encoded', express.static(path.join(__dirname, 'uploads/encoded')));

// ═══════════════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════════════
app.use("/api/users", userRouter);
app.use("/api/users", favoriteRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genre", genreRouter);
app.use("/api/countrie", countrieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/comments", commentRouter);
app.use("/api/ratings", require("./src/routes/ratingRouter"));
app.use("/api/upload", uploadRouter);
app.use("/api/vip", vipRouter);
app.use("/api/history", historyRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin/statistics", statisticsRouter);

// AI Chat Routes
app.use("/api/ai", chatRouter);

// ═══════════════════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT
// ═══════════════════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error("❌ Global error handler:", err);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: "Kích thước tệp quá lớn. Tối đa 10MB."
    });
  }

  // Multer other errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} không tồn tại.`
  });
});

// ═══════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   🎬 CINEMA NEW API                      ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on port ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}    ║
║  API Base: http://localhost:${PORT}/api                   ║
╚═══════════════════════════════════════════════════════════╝

📍 Available AI Endpoints:
   POST   /api/ai/chat          - Chat với AI (streaming)
   GET    /api/ai/history       - Lấy lịch sử chat
   DELETE /api/ai/history       - Xóa lịch sử chat
   GET    /api/ai/quick-actions - Lấy quick actions
   GET    /api/ai/health        - Kiểm tra AI status
    `);
});