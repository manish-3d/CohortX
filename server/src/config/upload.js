const multer =
  require("multer");

const fs =
  require("fs");

const path =
  require("path");

const uploadDir =
  path.join(
    __dirname,
    "../../uploads"
  );

fs.mkdirSync(
  uploadDir,
  {
    recursive: true,
  }
);

const storage =
  multer.diskStorage({
    destination(
      req,
      file,
      cb
    ) {
      cb(
        null,
        uploadDir
      );
    },

    filename(
      req,
      file,
      cb
    ) {
      cb(
        null,

        Date.now() +
          path.extname(
            file.originalname
          )
      );
    },
  });

function fileFilter(
  req,
  file,
  cb
) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (
    allowed.includes(
      file.mimetype
    )
  ) {
    cb(
      null,
      true
    );
  } else {
    cb(
      new Error(
        "Invalid file"
      )
    );
  }
}

module.exports =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        50 *
        1024 *
        1024,
    },
  });
