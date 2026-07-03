const Listing = require("../models/Listing");

/**
 * Create Listing
 */
exports.createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Public Listings
 */
exports.getListings = async (req, res) => {
  try {
    const {
      location,
      minRent,
      maxRent,
      roomType,
      furnishing,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "Available",
    };

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (roomType) {
      query.roomType = roomType;
    }

    if (furnishing) {
      query.furnishing = furnishing;
    }

    if (minRent || maxRent) {
      query.rent = {};

      if (minRent) query.rent.$gte = Number(minRent);

      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
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
 * Owner Listings
 */
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      owner: req.user.id,
    }).sort({
      createdAt: -1,
    });

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
 * Single Listing
 */
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "owner",
      "name email",
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Listing
 */
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    Object.assign(listing, req.body);

    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing updated",
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Listing
 */
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Mark Listing Filled
 */
exports.markFilled = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    listing.status = "Filled";

    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing marked as filled",
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
