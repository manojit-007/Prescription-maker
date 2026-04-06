const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();

const { PORT, ORIGIN } = process.env;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Server and page is ready");
});

app.listen(PORT, () => {
    console.log("Server listening");
})