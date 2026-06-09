const router = require("express").Router();

const {
  startConversation,
  listConversations,
} = require("../controllers/conversationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, listConversations);

router.post("/", isAuthenticated, startConversation);

module.exports = router;
