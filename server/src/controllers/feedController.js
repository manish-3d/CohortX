const prisma =
  require("../config/db");

exports.getFeed =
  async (
    req,
    res
  ) => {
    try {

      const following =
        await prisma.follow.findMany({
          where: {
            followerId:
              req.user.id,
          },

          select: {
            followingId:
              true,
          },
        });

      const ids =
        following.map(
          (f) =>
            f.followingId
        );

      const projects =
        await prisma.project.findMany({
          where:
            ids.length
              ? {
                  authorId: {
                    in: ids,
                  },
                }
              : {},

          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },

            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },

          orderBy: {
            createdAt:
              "desc",
          },

          take: 20,
        });

      return res.json(
        projects
      );

    } catch (err) {

      console.log(err);

      return res
        .status(500)
        .json({
          message:
            "Failed to load feed",
        });

    }
  };