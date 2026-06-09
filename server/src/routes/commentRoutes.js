const express = require("express");

const {
  createComment,

  getComments,

  deleteComment,
} = require("../controllers/commentController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/comments",

  isAuthenticated,

  createComment
);

router.get(
  "/:id/comments",

  getComments
);

router.delete(
  "/comments/:id",

  isAuthenticated,

  deleteComment
);

module.exports = router;
