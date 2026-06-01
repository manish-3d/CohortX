const express =
require(
"express"
);

const {
followUser,

unfollowUser

} =
require(
"../controllers/followController"
);

const {
isAuthenticated

} =
require(
"../middleware/authMiddleware"
);

const router =
express.Router();

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

module.exports =
router;