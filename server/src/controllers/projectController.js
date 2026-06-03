const prisma = require("../config/db");

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      githubUrl,
      demoUrl,
      coverImage,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        demoUrl,
        coverImage,
        authorId: req.user.id,
      },
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.getProjects = async (req, res) => {
  try {
    const projects =
      await prisma.project.findMany({
        include: {
          author: {
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

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project =
      await prisma.project.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
  author: {
    select: {
      username: true,
      avatar: true,
    },
  },

  comments: {
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  },

  likes: {
    select: {
      userId: true,
    },
  },
},
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const {
      title,
      description,
      githubUrl,
      demoUrl,
      coverImage,
    } = req.body;

    const project =
      await prisma.project.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.authorId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const updatedProject =
      await prisma.project.update({
        where: {
          id: req.params.id,
        },
        data: {
          title,
          description,
          githubUrl,
          demoUrl,
          coverImage,
        },
      });

    res.json(updatedProject);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    const project =
      await prisma.project.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.authorId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await prisma.project.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Project deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.exploreProjects = async (req, res) => {
  try {
    const projects =
      await prisma.project.findMany({
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
          createdAt: "desc",
        },

        take: 30,
      });

    return res.json(projects);

  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({
        message:
          "Explore failed",
      });
  }
};