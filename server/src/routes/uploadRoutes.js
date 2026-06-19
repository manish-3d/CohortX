const express = require("express");

const { uploadImage } = require("../controllers/uploadController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const upload = require("../config/upload");

const router = express.Router();

router.post(
  "/image",

  isAuthenticated,

  upload.single("image"),

  uploadImage
);

module.exports = router;
