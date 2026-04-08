const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { rateLimit } = require("express-rate-limit"); 

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => { 
    res.status(429).json({ message: "⏳ Too many requests, slow down." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT,FRONTEND_URL } = process.env;

app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(limiter);
app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server and page is ready");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});