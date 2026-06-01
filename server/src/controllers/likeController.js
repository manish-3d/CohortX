const prisma = require("../config/db");

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