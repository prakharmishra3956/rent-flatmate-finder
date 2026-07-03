const mongoose = require("mongoose");

const tenantProfileSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    preferredLocation: {
      type: String,
      required: true,
      trim: true,
    },

    budgetMin: {
      type: Number,
      required: true,
    },

    budgetMax: {
      type: Number,
      required: true,
    },

    moveInDate: {
      type: Date,
      required: true,
    },

    preferredRoomType: {
      type: String,
      enum: ["Single", "Double", "Shared"],
      required: true,
    },

    preferredAmenities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("TenantProfile", tenantProfileSchema);
