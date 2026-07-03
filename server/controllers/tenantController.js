const TenantProfile = require("../models/TenantProfile");

/*
Create Profile
*/

exports.createProfile = async (req, res) => {
  try {
    const exists = await TenantProfile.findOne({
      tenant: req.user.id,
    });

    if (exists) {
      return res.status(400).json({
        success: false,

        message: "Profile already exists",
      });
    }

    const profile = await TenantProfile.create({
      tenant: req.user.id,

      ...req.body,
    });

    res.status(201).json({
      success: true,

      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
Get Profile
*/

exports.getProfile = async (req, res) => {
  try {
    const profile = await TenantProfile.findOne({
      tenant: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,

        message: "Profile not found",
      });
    }

    res.json({
      success: true,

      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
Update Profile
*/

exports.updateProfile = async (req, res) => {
  try {
    const profile = await TenantProfile.findOne({
      tenant: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,

        message: "Profile not found",
      });
    }

    Object.assign(profile, req.body);

    await profile.save();

    res.json({
      success: true,

      message: "Profile Updated",

      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const Listing = require("../models/Listing");
const Compatibility = require("../models/Compatibility");
const compatibilityService = require("../services/ai/compatibilityService");

exports.getCompatibilityScore = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { listingId } = req.params;

    const tenantProfile = await TenantProfile.findOne({ tenant: tenantId });
    if (!tenantProfile) {
      return res.status(400).json({
        success: false,
        message: "Please set up your Tenant Profile preferences first",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    let compatibility = await Compatibility.findOne({
      tenant: tenantId,
      listing: listingId,
    });

    if (!compatibility) {
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

    res.status(200).json({
      success: true,
      compatibility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
