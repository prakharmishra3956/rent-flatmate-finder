const Listing = require("../models/Listing");
const Interest = require("../models/Interest");

/**
 * Get Owner Dashboard Statistics
 */
exports.getOwnerStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Fetch counts in parallel
    const [total, available, filled, requests] = await Promise.all([
      Listing.countDocuments({ owner: ownerId }),
      Listing.countDocuments({ owner: ownerId, status: "Available" }),
      Listing.countDocuments({ owner: ownerId, status: "Filled" }),
      Interest.countDocuments({ owner: ownerId, status: "Pending" }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        available,
        filled,
        requests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
