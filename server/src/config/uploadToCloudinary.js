const cloudinary = require("./cloudinary");

/**
 * Upload a multer memory-buffer file to Cloudinary.
 *
 * @param {Object} file - The multer file object (req.file) with `buffer` and `mimetype`.
 * @param {string} folder - The Cloudinary folder name (e.g. "cohortx/projects").
 * @returns {Promise<{ secure_url: string, public_id: string, resource_type: string }>}
 */
function uploadToCloudinary(file, folder = "cohortx") {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video") ? "video" : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

module.exports = uploadToCloudinary;
