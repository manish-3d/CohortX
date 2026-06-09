const prisma = require("../config/db");

exports.createComment = async (req, res) => {
  try {
    const projectId = req.params.id;

    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,

        userId: req.user.id,

        projectId,
      },

      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        projectId: req.params.id,
      },

      include: {
        user: {
          select: {
            username: true,

            avatar: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await prisma.comment.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Comment deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
