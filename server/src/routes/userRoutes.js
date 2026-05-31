const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const {
  isAuthenticated,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:username", getProfile);

router.put(
  "/profile/edit",
  isAuthenticated,
  updateProfile
);

module.exports = router;