const { body } = require("express-validator");

exports.createListingValidator = [
  body("title").notEmpty().withMessage("Title is required"),

  body("description").notEmpty().withMessage("Description is required"),

  body("location").notEmpty().withMessage("Location is required"),

  body("address").notEmpty().withMessage("Address is required"),

  body("rent")
    .isNumeric()
    .withMessage("Rent must be a number")
    .isFloat({ min: 1 })
    .withMessage("Rent must be greater than 0"),

  body("availableFrom").notEmpty().withMessage("Available date is required"),

  body("roomType")
    .isIn(["Single", "Double", "Shared"])
    .withMessage("Invalid room type"),

  body("furnishing")
    .isIn(["Furnished", "Semi Furnished", "Unfurnished"])
    .withMessage("Invalid furnishing type"),
];
