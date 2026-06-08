const router =
require(
"express"
)
.Router();

const {
sendMessage,
getMessages,
}=
require(
"../controllers/messageController"
);
const {
isAuthenticated,
}=
require(
"../middleware/authMiddleware"
);

router.get(
"/:conversationId",
isAuthenticated,
getMessages
);

router.post(
"/",
isAuthenticated,
sendMessage
);

module.exports =
router;
