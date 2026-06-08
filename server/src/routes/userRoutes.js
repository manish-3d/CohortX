const express = require("express");

const {
  getProfile,
  searchUsers,
  updateProfile,
  uploadAvatar,
} = require("../controllers/userController");
const upload = require("../config/upload");
const {isAuthenticated,} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", searchUsers);

router.get(
  "/:username",
  getProfile
);

router.put(
  "/profile/edit",
  isAuthenticated,
  updateProfile
);
router.post(
  "/avatar",

  isAuthenticated,

  upload.single(
    "avatar"
  ),

  uploadAvatar
);

module.exports = router;
