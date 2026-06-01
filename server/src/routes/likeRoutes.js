const express = require("express");

const {
  likeProject,
  unlikeProject,
} = require("../controllers/likeController");

const {
  isAuthenticated,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/like",
  isAuthenticated,
  likeProject
);

router.delete(
  "/:id/like",
  isAuthenticated,
  unlikeProject
);

module.exports = router;