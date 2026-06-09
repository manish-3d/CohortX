const router = require("express").Router();

const { isAuthenticated } = require("../middleware/authMiddleware");

const { getNotifications } = require("../controllers/notificationController");

router.get(
  "/",

  isAuthenticated,

  getNotifications
);

module.exports = router;
