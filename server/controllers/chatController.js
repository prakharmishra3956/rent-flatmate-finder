const Message = require("../models/Message");
const Listing = require("../models/Listing");

/**
 * Fetch chat messages between tenant and owner for a specific listing
 */
exports.getChatHistory = async (req, res) => {
  try {
    const { listingId, tenantId } = req.params;
    const userId = req.user.id;

    // 1. Fetch Listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const ownerId = listing.owner.toString();

    // 2. Authorization check: user must be the tenant or owner involved
    if (userId !== tenantId && userId !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this chat conversation",
      });
    }

    // 3. Query messages
    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: tenantId, recipient: ownerId },
        { sender: ownerId, recipient: tenantId },
      ],
    }).sort({ createdAt: 1 }); // Sorted chronologically

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
