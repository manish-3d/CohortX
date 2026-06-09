const express = require("express");

const {
  followUser,

  unfollowUser,

  getFollowers,

  getFollowing,
} = require("../controllers/followController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/follow",

  isAuthenticated,

  followUser
);

router.delete(
  "/:id/follow",

  isAuthenticated,

  unfollowUser
);

router.get(
  "/:id/followers",

  isAuthenticated,

  getFollowers
);

router.get(
  "/:id/following",

  isAuthenticated,

  getFollowing
);

module.exports = router;
