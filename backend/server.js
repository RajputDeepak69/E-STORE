// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const sequelize = require("./db/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");

const app = express();

// CORS: restrict to your frontend origin (set FRONTEND_ORIGIN in env)
const allowedOrigins = new Set([process.env.FRONTEND_ORIGIN || "http://localhost:3000"]);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);            // allow Postman/curl
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Security headers + hide framework
app.disable("x-powered-by");
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("🚀 Backend up & running!"));

// Light rate limit for auth endpoints (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per IP per window on /auth
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/auth", authLimiter);

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

// DB connect with retries, then start server
const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connected");

      await sequelize.sync({ alter: true });
      console.log("✅ DB synced");

      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () =>
        console.log(`✅ Server running on http://localhost:${PORT}`)
      );
      break;
    } catch (err) {
      console.error("❌ DB connection failed. Retrying in 5s...", err.message);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (retries === 0) {
    console.error("❌ Could not connect to DB after multiple attempts. Exiting...");
    process.exit(1);
  }
};

connectDB();