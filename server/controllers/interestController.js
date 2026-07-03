const Interest = require("../models/Interest");
const Listing = require("../models/Listing");

/**
 * Tenant expresses interest in a room
 */
exports.expressInterest = async (req, res) => {
  try {
    const { listingId, message } = req.body;
    const tenantId = req.user.id;

    // Find Listing to verify it exists and get owner details
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Prevent owner expressing interest in their own listing
    if (listing.owner.toString() === tenantId) {
      return res.status(400).json({
        success: false,
        message: "Cannot express interest in your own listing",
      });
    }

    // Check if duplicate request exists
    const exists = await Interest.findOne({
      tenant: tenantId,
      listing: listingId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You have already expressed interest in this listing",
      });
    }

    // Create Interest
    const interest = await Interest.create({
      tenant: tenantId,
      listing: listingId,
      owner: listing.owner,
      message,
    });

    // Handle high compatibility email notification asynchronously
    try {
      const Compatibility = require("../models/Compatibility");
      let compatibility = await Compatibility.findOne({
        tenant: tenantId,
        listing: listingId,
      });

      if (!compatibility) {
        const TenantProfile = require("../models/TenantProfile");
        const tenantProfile = await TenantProfile.findOne({ tenant: tenantId });
        if (tenantProfile) {
          const compatibilityService = require("../services/ai/compatibilityService");
          const result = await compatibilityService.calculateCompatibility(
            tenantProfile,
            listing
          );
          compatibility = await Compatibility.create({
            tenant: tenantId,
            listing: listingId,
            score: result.score,
            explanation: result.explanation,
          });
        }
      }

      if (compatibility && compatibility.score > 80) {
        const User = require("../models/User");
        const ownerUser = await User.findById(listing.owner);
        const tenantUser = await User.findById(tenantId);
        if (ownerUser && tenantUser) {
          const emailService = require("../services/email/emailService");
          await emailService.sendHighCompatibilityAlert({
            ownerEmail: ownerUser.email,
            ownerName: ownerUser.name,
            tenantName: tenantUser.name,
            listingTitle: listing.title,
            score: compatibility.score,
          });
        }
      }
    } catch (emailErr) {
      console.error("Error triggering high compatibility email:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      interest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Tenant retrieves their sent interest requests
 */
exports.getTenantInterests = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const interests = await Interest.find({ tenant: tenantId })
      .populate("listing", "title location rent status photos")
      .populate("owner", "name email");

    const Compatibility = require("../models/Compatibility");
    const interestsWithComp = await Promise.all(
      interests.map(async (interest) => {
        const comp = await Compatibility.findOne({
          tenant: tenantId,
          listing: interest.listing._id,
        });
        return {
          ...interest.toObject(),
          compatibility: comp || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      interests: interestsWithComp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Owner retrieves received interest requests
 */
exports.getOwnerInterests = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const interests = await Interest.find({ owner: ownerId })
      .populate("listing", "title location rent status")
      .populate("tenant", "name email");

    const Compatibility = require("../models/Compatibility");
    const interestsWithComp = await Promise.all(
      interests.map(async (interest) => {
        const comp = await Compatibility.findOne({
          tenant: interest.tenant._id,
          listing: interest.listing._id,
        });
        return {
          ...interest.toObject(),
          compatibility: comp || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      interests: interestsWithComp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Owner accepts or rejects interest request
 */
exports.updateInterestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ownerId = req.user.id;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update. Must be Accepted or Rejected.",
      });
    }

    const interest = await Interest.findById(id);
    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Interest request not found",
      });
    }

    // Verify ownership
    if (interest.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    interest.status = status;
    await interest.save();

    // Trigger status update email alert asynchronously
    try {
      const User = require("../models/User");
      const tenantUser = await User.findById(interest.tenant);
      const ownerUser = await User.findById(interest.owner);
      const listing = await Listing.findById(interest.listing);
      if (tenantUser && ownerUser && listing) {
        const emailService = require("../services/email/emailService");
        await emailService.sendInterestStatusUpdate({
          tenantEmail: tenantUser.email,
          tenantName: tenantUser.name,
          ownerName: ownerUser.name,
          listingTitle: listing.title,
          status: status,
        });
      }
    } catch (emailErr) {
      console.error("Error triggering status update email:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()}`,
      interest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
