const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const todoRoutes = require("./routes/todoRoutes");
const searchRoutes = require("./routes/searchRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;
const FUNCTION_TIMEOUT = process.env.VERCEL_FUNCTION_TIMEOUT || 10;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
	cors({
		origin: [
			process.env.FRONTEND_URL,
			"http://localhost:5173", // Updated for Vite's default port
			"https://dp-calendar.vercel.app",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
	})
);
app.options("*", cors());

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Timeout middleware
app.use((req, res, next) => {
	res.setTimeout(FUNCTION_TIMEOUT * 1000, () => {
		res.status(408).send("Request Timeout");
	});
	next();
});

// Database connection
const connectToDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		});
		console.log("Connected to MongoDB Atlas");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

// Routes
app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is running" });
});

// Add this route before your other routes
app.get("/favicon.ico", (req, res) => {
	res.sendStatus(204); // No Content
});

app.use("/api/users", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/settings", settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		status: "error",
		message: "An unexpected error occurred on the server",
		error: process.env.NODE_ENV === "development" ? err.message : undefined,
	});
});

// Instead of app.listen(), export the app
const startServer = async () => {
	await connectToDatabase();
	return app;
};

module.exports = startServer();

// You can keep the listen call for local development
if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
