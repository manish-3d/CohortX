const express =
require(
"express"
);

const {
uploadImage

} =
require(
"../controllers/uploadController"
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
"/image",

isAuthenticated,

uploadImage
);

module.exports =
router;