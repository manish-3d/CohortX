const prisma = require("../config/db");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            avatar: true,

            username: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("NOTIFICATIONS ↓", notifications);

    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({
      message: "Failed",
    });
  }
};

exports.markRead = async (req, res) => {
  try {
    await prisma.notification.update({
      where: {
        id: req.params.id,
      },

      data: {
        isRead: true,
      },
    });

    return res.json({
      message: "Read",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,

        isRead: false,
      },
    });

    return res.json({
      count,
    });
  } catch {
    return res.status(500).json({
      count: 0,
    });
  }
};
