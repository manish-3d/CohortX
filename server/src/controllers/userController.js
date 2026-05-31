const prisma = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        avatar: true,
        githubUsername: true,
        linkedinUrl: true,
        xUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const {
      bio,
      avatar,
      githubUsername,
      linkedinUrl,
      xUrl,
    } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        bio,
        avatar,
        githubUsername,
        linkedinUrl,
        xUrl,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};