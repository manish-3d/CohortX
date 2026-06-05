
const router =
  require("express")
    .Router();

const {
  isAuthenticated,
} =
  require(
    "../middleware/authMiddleware"
  );

const upload =
  require(
    "../config/upload"
  );

const {

  createStory,

  getStories,

} =
require(
  "../controllers/storyController"
);

router.post(

  "/",

  isAuthenticated,

  upload.single(
    "media"
  ),

  createStory

);

router.get(

  "/",

  isAuthenticated,

  getStories

);

module.exports =
  router;
