const uploadToCloudinary = require("../config/uploadToCloudinary");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    const result = await uploadToCloudinary(req.file, "cohortx");

    res.json({
      url: result.secure_url,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};
