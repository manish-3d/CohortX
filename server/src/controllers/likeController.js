const prisma = require("../config/db");

async function getLikeCount(projectId) {
  return prisma.like.count({
    where: {
      projectId,
    },
  });
}

exports.likeProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const existing =
      await prisma.like.findUnique({
        where: {
          userId_projectId: {
            userId: req.user.id,
            projectId,
          },
        },
      });

    if (existing) {
      return res.status(400).json({
        message: "Already liked",
      });
    }

    await prisma.like.create({
      data: {
        userId: req.user.id,
        projectId,
      },
    });

    res.json({
      message: "Project liked",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.toggleProjectLike = async (
  req,
  res
) => {
  try {
    const projectId =
      req.params.id;

    const project =
      await prisma.project.findUnique({
        where: {
          id: projectId,
        },

        select: {
          id: true,
        },
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const where = {
      userId_projectId: {
        userId: req.user.id,
        projectId,
      },
    };

    const existing =
      await prisma.like.findUnique({
        where,
      });

    if (existing) {
      await prisma.like.delete({
        where,
      });

      return res.json({
        liked: false,
        likesCount:
          await getLikeCount(
            projectId
          ),
        message: "Like removed",
      });
    }

    await prisma.like.create({
      data: {
        userId: req.user.id,
        projectId,
      },
    });

    return res.json({
      liked: true,
      likesCount:
        await getLikeCount(
          projectId
        ),
      message: "Project liked",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.unlikeProject = async (
  req,
  res
) => {
  try {
    await prisma.like.delete({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: req.params.id,
        },
      },
    });

    res.json({
      message: "Like removed",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
