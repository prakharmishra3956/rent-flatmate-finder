const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,

      email,

      password: hashedPassword,

      role,
    });

    res.status(201).json({
      message: "User Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,

      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      owner: req.user.id,

      ...req.body,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getListings = async (req, res) => {
  const listings = await Listing.find()

    .populate("owner", "name email");

  res.json(listings);
};

exports.getListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)

    .populate("owner");

  res.json(listing);
};

exports.updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  if (listing.owner.toString() != req.user.id) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  Object.assign(listing, req.body);

  await listing.save();

  res.json(listing);
};

exports.deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      message: "Not Found",
    });
  }

  await listing.deleteOne();

  res.json({
    message: "Deleted",
  });
};

exports.markFilled = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  listing.status = "Filled";

  await listing.save();

  res.json(listing);
};


