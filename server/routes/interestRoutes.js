const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/interestController");

// Express interest (Tenant only)
router.post("/", auth, role("tenant"), controller.expressInterest);

// View sent interests (Tenant only)
router.get("/tenant", auth, role("tenant"), controller.getTenantInterests);

// View received interests (Owner only)
router.get("/owner", auth, role("owner"), controller.getOwnerInterests);

// Update status (Owner only)
router.patch("/:id/status", auth, role("owner"), controller.updateInterestStatus);

module.exports = router;
