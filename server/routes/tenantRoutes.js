const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const role = require("../middleware/roleMiddleware");

const validate = require("../middleware/validate");

const { tenantProfileValidator } = require("../validator/tenantValidator");

const controller = require("../controllers/tenantController");

router.post(
  "/profile",

  auth,

  role("tenant"),

  tenantProfileValidator,

  validate,

  controller.createProfile,
);

router.get(
  "/profile",

  auth,

  role("tenant"),

  controller.getProfile,
);

router.put(
  "/profile",

  auth,

  role("tenant"),

  controller.updateProfile,
);

router.get(
  "/compatibility/:listingId",
  auth,
  role("tenant"),
  controller.getCompatibilityScore,
);

module.exports = router;
