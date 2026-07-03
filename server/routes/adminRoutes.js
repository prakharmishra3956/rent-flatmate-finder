const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/adminController");

// All admin routes require authentication and the "admin" role
router.get("/dashboard", auth, role("admin"), controller.getDashboardStats);
router.get("/users", auth, role("admin"), controller.getUsers);
router.delete("/users/:id", auth, role("admin"), controller.deleteUser);
router.get("/listings", auth, role("admin"), controller.getListings);
router.delete("/listings/:id", auth, role("admin"), controller.deleteListing);
router.patch("/listings/:id/fill", auth, role("admin"), controller.markListingFilled);

module.exports = router;
