const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    availableFrom: {
      type: Date,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Shared"],
      required: true,
    },

    furnishing: {
      type: String,
      enum: ["Furnished", "Semi Furnished", "Unfurnished"],
      required: true,
    },

    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Any"],
      default: "Any",
    },

    occupancy: {
      type: Number,
      default: 1,
    },

    amenities: [String],

    photos: [
      {
        url: String,
        public_id: String,
      },
    ],

    status: {
      type: String,
      enum: ["Available", "Filled"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Listing", listingSchema);
