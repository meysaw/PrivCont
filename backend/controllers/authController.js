const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim();

        if (cleanUsername.length < 3 || cleanUsername.length > 30) {
            return res.status(400).json({
                message: "Username must be 3 to 30 characters"
            });
        }

        if (!EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                message: "Password must be 8 to 72 characters"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email: cleanEmail }, { username: cleanUsername }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or username is already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email or username is already in use"
            });
        }
        console.error("Register error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid input" });
        }

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { register, login };