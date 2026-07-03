const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const { uploadImages } = require("../controllers/uploadController");

router.post("/", auth, role("owner"), upload.array("images", 5), uploadImages);

module.exports = router;
