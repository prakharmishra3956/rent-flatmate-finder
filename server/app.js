const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Rent & Flatmate Finder API Running");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const interestRoutes = require("./routes/interestRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
