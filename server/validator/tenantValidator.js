const { body } = require("express-validator");

exports.tenantProfileValidator = [
  body("preferredLocation")
    .notEmpty()
    .withMessage("Preferred location is required"),

  body("budgetMin").isNumeric().withMessage("Budget must be numeric"),

  body("budgetMax").isNumeric().withMessage("Budget must be numeric"),

  body("moveInDate").notEmpty().withMessage("Move in date required"),

  body("preferredRoomType")
    .isIn(["Single", "Double", "Shared"])
    .withMessage("Invalid room type"),
];
