const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const appRouter = require("./routes/routes");
const connectToDatabase = require("./config/mongodb");

require("dotenv").config();

const app = express();

const { PORT, FRONTEND_URL, MONGODB_URI } = process.env;


// ✅ Connect DB
connectToDatabase(MONGODB_URI);


// ✅ Rate limiter (apply EARLY)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "⏳ Too many requests, slow down." },
});


// ✅ Middleware order FIXED
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(limiter); // 🔥 before routes


// ✅ Routes
app.use("/api", appRouter);


// ✅ Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  // Mongo duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});