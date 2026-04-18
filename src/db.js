const path = require("path");
const mysql = require("mysql2");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi kết nối:", err);
  } else {
    console.log("✅ Đã bắt được MySQL!!!");
  }
});

module.exports = db;