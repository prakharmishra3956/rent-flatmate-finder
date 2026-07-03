const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/chatController");

// Fetch chat history between tenant and owner
router.get("/:listingId/:tenantId", auth, controller.getChatHistory);

module.exports = router;
