const prisma = require("../config/db");

/* ==========================
   CREATE PROJECT
========================== */

exports.createProject = async (req, res) => {
  try {
    const { title, description, githubUrl, demoUrl } = req.body;

    let mediaUrl = null;

    let mediaType = null;

    if (req.file) {
      mediaUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        demoUrl,
        mediaUrl,
        mediaType,

        authorId: req.user.id,
      },
    });

    return res.status(201).json(project);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Create failed",
    });
  }
};

/* ==========================
   GET ALL PROJECTS
========================== */

exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        author: {
          select: {
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

        likes: {
          where: {
            userId: req.user.id,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(
      projects.map((project) => ({
        ...project,

        liked: project.likes.some((like) => like.userId === req.user.id),
      }))
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

/* ==========================
   GET SINGLE PROJECT
========================== */

exports.getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
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

        _count: {
          select: {
            likes: true,

            comments: true,
          },
        },

        likes: {
          where: {
            userId: req.user.id,
          },

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

/* ==========================
   UPDATE PROJECT
========================== */

exports.updateProject = async (req, res) => {
  try {
    const { title, description, githubUrl, demoUrl, mediaUrl, mediaType } =
      req.body;

    const updated = await prisma.project.update({
      where: {
        id: req.params.id,
      },

      data: {
        title,
        description,
        githubUrl,
        demoUrl,
        mediaUrl,
        mediaType,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ==========================
   DELETE PROJECT
========================== */

exports.deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ==========================
   EXPLORE PROJECTS
========================== */

exports.exploreProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        author: true,

        _count: {
          select: {
            likes: true,

            comments: true,
          },
        },

        likes: {
          where: {
            userId: req.user.id,
          },

          select: {
            userId: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = projects.map((project) => ({
      ...project,

      liked: project.likes.length > 0,
    }));

    return res.json(formatted);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Explore failed",
    });
  }
};
