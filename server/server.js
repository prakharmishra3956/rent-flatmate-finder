const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");
const Message = require("./models/Message");

dotenv.config();

// Connect Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a unique chat room for a listing and tenant
  socket.on("join_room", ({ listingId, tenantId }) => {
    const roomName = `${listingId}_${tenantId}`;
    socket.join(roomName);
    console.log(`User socket ${socket.id} joined room: ${roomName}`);
  });

  // Handle incoming real-time messages
  socket.on("send_message", async (data) => {
    try {
      const { senderId, recipientId, listingId, tenantId, content } = data;

      if (!senderId || !recipientId || !listingId || !tenantId || !content.trim()) {
        return;
      }

      // Persist to MongoDB
      const savedMessage = await Message.create({
        sender: senderId,
        recipient: recipientId,
        listing: listingId,
        content: content.trim(),
      });

      const roomName = `${listingId}_${tenantId}`;
      io.to(roomName).emit("receive_message", savedMessage);
    } catch (err) {
      console.error("Socket send_message error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
