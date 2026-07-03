const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    preferredLocation: String,

    budgetMin: Number,

    budgetMax: Number,

    moveInDate: Date,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", profileSchema);
