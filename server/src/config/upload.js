const multer = require("multer");

// Use memory storage instead of disk — files are kept in RAM as buffers
// and uploaded to Cloudinary from the controller, so nothing touches disk.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file"));
  }
}

module.exports = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
