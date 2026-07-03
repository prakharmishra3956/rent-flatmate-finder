const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

router.get("/me", auth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});

module.exports = router;
