

require("dotenv").config();
require("express-async-errors");

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const session = require("express-session");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

const mainRouter = require("./routes/main");
const authRouter = require("./routes/userRoutes");      // Auth routes: register, login, current user
const profileRouter = require("./routes/profile"); // Profile routes: create, get profile

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Port
const PORT = process.env.PORT || 5000;

// Mongo URI check
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// --- Logging Middleware for key routes ---
app.use((req, res, next) => {
  const { method, originalUrl, body } = req;

  if (method === "POST") {
    if (originalUrl === "/api/auth/register") {
      console.log(`🔐 Registration Attempt - Username: ${body.username || "N/A"}, Email: ${body.email || "N/A"}`);
    } else if (originalUrl === "/api/auth/login") {
      console.log(`🔑 Login Attempt - Email: ${body.email || "N/A"}`);
    } else if (originalUrl.startsWith("/api/profile/create")) {
      console.log(`📝 Profile Creation Attempt - UserId: ${req.session?.userId || "unknown"}`);
      console.log("Profile Data:", body);
    } else if (originalUrl.startsWith("/api/profile/update")) {
      console.log(`✏️ Profile Update Attempt - UserId: ${req.session?.userId || "unknown"}`);
      console.log("Profile Data:", body);
    }
  }

  next();
});

// Routes
app.use("/", mainRouter);
app.use("/api/auth", authRouter);       // Register, login, current user
app.use("/api/profile", profileRouter); // Profile routes protected internally

// Error Handling Middleware (for express-async-errors)
app.use(errorHandler);

// Socket.io Chat
io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("chat message", (msg) => {
    console.log("📨 Message received:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected");
  });
});

// Start Server and Connect DB
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};

startServer();
