const router = require("express").Router();

const { isAuthenticated } = require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
  markRead,
} = require("../controllers/notificationController");

router.get("/count", isAuthenticated, getUnreadCount);

router.get(
  "/",

  isAuthenticated,

  getNotifications
);

router.patch("/:id/read", isAuthenticated, markRead);

module.exports = router;
