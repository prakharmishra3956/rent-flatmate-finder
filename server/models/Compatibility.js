const mongoose = require("mongoose");

const compatibilitySchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique combination of tenant and listing to prevent duplicate computations
compatibilitySchema.index({ tenant: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model("Compatibility", compatibilitySchema);
