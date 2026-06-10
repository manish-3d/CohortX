const router = require("express").Router();

const { isAuthenticated } = require("../middleware/authMiddleware");

const {
  startLive,
  getLives,
  endLive,
  attachRecording,
} = require("../controllers/liveController");

router.post("/start", isAuthenticated, startLive);

router.get("/", getLives);

router.patch("/:id/end", isAuthenticated, endLive);

router.patch("/:id/recording", isAuthenticated, attachRecording);

module.exports = router;
