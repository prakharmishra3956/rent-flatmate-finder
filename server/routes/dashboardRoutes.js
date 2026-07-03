const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/dashboardController");

// Owner Stats Route
router.get("/owner", auth, role("owner"), controller.getOwnerStats);

module.exports = router;
