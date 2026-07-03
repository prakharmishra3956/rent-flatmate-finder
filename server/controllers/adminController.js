const User = require("../models/User");
const Listing = require("../models/Listing");
const Interest = require("../models/Interest");
const TenantProfile = require("../models/TenantProfile");
const Compatibility = require("../models/Compatibility");

/**
 * Get Admin Dashboard Stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const filledListings = await Listing.countDocuments({ status: "Filled" });
    const pendingInterests = await Interest.countDocuments({ status: "Pending" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalListings,
        filledListings,
        pendingInterests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete User and Clean Up
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    // Clean up listings, interests, profiles, compatibility records
    if (user.role === "owner") {
      // Find all listings owned by this user
      const listings = await Listing.find({ owner: id });
      const listingIds = listings.map((l) => l._id);

      // Delete interests and compatibility records associated with those listings
      await Interest.deleteMany({ listing: { $in: listingIds } });
      await Compatibility.deleteMany({ listing: { $in: listingIds } });

      // Delete listings
      await Listing.deleteMany({ owner: id });
    } else if (user.role === "tenant") {
      // Delete tenant profile, compatibility, and interests
      await TenantProfile.deleteOne({ tenant: id });
      await Interest.deleteMany({ tenant: id });
      await Compatibility.deleteMany({ tenant: id });
    }

    // Finally, delete the user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User and all associated data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Listings
 */
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Specific Listing
 */
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Clean up interests and compatibility
    await Interest.deleteMany({ listing: id });
    await Compatibility.deleteMany({ listing: id });

    // Delete listing
    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing and associated data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Toggle Listing status (Available / Filled)
 */
exports.markListingFilled = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    listing.status = listing.status === "Filled" ? "Available" : "Filled";
    await listing.save();

    res.status(200).json({
      success: true,
      message: `Listing status updated to ${listing.status}`,
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
