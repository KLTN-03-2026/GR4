const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const db = require("./src/db");

// ═══════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════
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
const webhookRouter = require("./src/routes/webhookRouter");

// ═══════════════════════════════════════
// ALLOWED ORIGINS (DOCKER SAFE)
// ═══════════════════════════════════════
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

// nếu có env bổ sung
if (process.env.CORS_ORIGINS) {
  process.env.CORS_ORIGINS.split(",").forEach((o) => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

// ═══════════════════════════════════════
// CORS CONFIG (FIX CHÍNH)
// ═══════════════════════════════════════
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("👉 Request origin:", origin);

      // allow tools like Postman / server-to-server
      if (!origin) return callback(null, true);

      // Chuẩn hóa origin (bỏ dấu / ở cuối nếu có) để so sánh chính xác
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(allowed => {
        return allowed.replace(/\/$/, "") === cleanOrigin;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("❌ Blocked origin:", origin);
      // Trả về lỗi rõ ràng như user gặp phải
      return callback(new Error("The CORS policy for this site does not allow access from the specified Origin."), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Set-Cookie"]
  })
);

// ═══════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ═══════════════════════════════════════
// STATIC FILES
// ═══════════════════════════════════════
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/hls", express.static(path.join(__dirname, "uploads/encoded")));
app.use("/encoded", express.static(path.join(__dirname, "uploads/encoded")));

// ═══════════════════════════════════════
// ROUTES REGISTER
// ═══════════════════════════════════════
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
app.use("/api/webhooks", webhookRouter);
app.use("/api/ai", chatRouter);

// ═══════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ═══════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} không tồn tại.`
  });
});

// ═══════════════════════════════════════
// ERROR HANDLER
// ═══════════════════════════════════════
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File quá lớn (max 10MB)"
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// ═══════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║            🎬 CINEMA NEW API              ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                             ║
║  ENV : ${process.env.NODE_ENV || "development"}          ║
║  API : http://localhost:${PORT}/api        ║
╚════════════════════════════════════════════╝
  `);
});