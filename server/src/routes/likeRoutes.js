const express = require("express");

const {
  likeProject,
  toggleProjectLike,
  unlikeProject,
} = require("../controllers/likeController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/like/toggle", isAuthenticated, toggleProjectLike);

router.post("/:id/like", isAuthenticated, likeProject);

router.delete("/:id/like", isAuthenticated, unlikeProject);

module.exports = router;
