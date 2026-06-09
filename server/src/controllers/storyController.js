const prisma = require("../config/db");

exports.createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Story media is required",
      });
    }

    const mediaUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const story = await prisma.story.create({
      data: {
        mediaUrl,

        mediaType,

        caption: req.body.caption || null,

        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),

        userId: req.user.id,
      },
    });

    return res.status(201).json(story);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Story upload failed",
    });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        user: {
          select: {
            id: true,

            username: true,

            avatar: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(stories);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Failed to fetch stories",
    });
  }
};
