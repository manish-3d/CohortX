const prisma = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const viewerId = req.user?.id;

    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },

        include: {
          projects: {
            include: {
              author: {
                select: {
                  avatar: true,

                  username: true,
                },
              },

              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },

              likes: {
                ...(viewerId
                  ? {
                      where: {
                        userId: viewerId,
                      },
                    }
                  : {}),

                select: {
                  userId: true,
                },
              },
            },
          },

          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      });

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found",
        });
    }

    return res.json(user);

  } catch (err) {

    console.log(err);

    return res
      .status(500)
      .json({
        message:
          "Server error",
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
exports.searchUsers = async (
  req,
  res
) => {
  try {
    const { q } = req.query;

    const users =
      await prisma.user.findMany({
        where: {
          username: {
            contains:
              q,

            mode:
              "insensitive",
          },
        },

        select: {
          id: true,

          username: true,

          bio: true,

          avatar: true,
        },

        take: 20,
      });

    return res.json(
      users
    );

  } catch {

    return res
      .status(500)
      .json({
        message:
          "Search failed",
      });
  }
};
exports.uploadAvatar =
  async (
    req,
    res
  ) => {
    try {
      if (
        !req.file
      ) {
        return res
          .status(400)
          .json({
            message:
              "Image required",
          });
      }

      const apiUrl =
        process.env.API_URL ||
        `${req.protocol}://${req.get("host")}`;

      const avatar =
        `${apiUrl}/uploads/${req.file.filename}`;

      const user =
        await prisma.user.update({
          where: {
            id:
              req.user.id,
          },

          data: {
            avatar,
          },
        });

      return res.json(
        user
      );

    } catch {

      return res
        .status(500)
        .json({
          message:
            "Upload failed",
        });

    }
  };
