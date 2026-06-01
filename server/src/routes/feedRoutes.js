const express =
require(
"express"
);

const {
getFeed

} =
require(
"../controllers/feedController"
);

const {
isAuthenticated

} =
require(
"../middleware/authMiddleware"
);

const router =
express.Router();

router.get(
"/",

isAuthenticated,

getFeed
);

module.exports =
router;