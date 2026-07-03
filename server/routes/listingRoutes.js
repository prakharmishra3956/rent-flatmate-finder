const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const controller = require("../controllers/listingController");

// Owner Routes
router.post("/", auth, role("owner"), controller.createListing);

router.get("/my", auth, role("owner"), controller.getMyListings);

router.put("/:id", auth, role("owner"), controller.updateListing);

router.delete("/:id", auth, role("owner"), controller.deleteListing);

router.patch("/:id/fill", auth, role("owner"), controller.markFilled);

// Public Routes
router.get("/", controller.getListings);

router.get("/:id", controller.getListing);

module.exports = router;

const validate = require("../middleware/validate");

const { createListingValidator } = require("../validator/listingValidator");

router.post(
  "/",
  auth,
  role("owner"),
  createListingValidator,
  validate,
  controller.createListing,
);
