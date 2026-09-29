require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contestRoutes = require("./routes/contestRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;


if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true, 
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many failed login attempts. Try again in 15 minutes." }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many accounts created from this network. Try again later." }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests. Please slow down." }
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registerLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin", adminRoutes);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Mongo connected");
    })
    .catch((error) => {
        console.error("mongodb connection error", error);
    });

app.get("/", (req, res) => {
    res.json({ message: "PrivCont API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});