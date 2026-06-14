const prisma = require("../config/db");

function getActorUsername(message) {
  const patterns = [
    /^(.+) liked your project$/,
    /^(.+) started a live session$/,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function withActors(notifications) {
  const usernames = [
    ...new Set(
      notifications
        .map((notification) => getActorUsername(notification.message))
        .filter(Boolean)
    ),
  ];

  if (!usernames.length) {
    return notifications.map((notification) => ({
      ...notification,
      actor: null,
    }));
  }

  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });

  const usersByUsername = new Map(users.map((user) => [user.username, user]));

  return notifications.map((notification) => ({
    ...notification,
    actor: usersByUsername.get(getActorUsername(notification.message)) || null,
  }));
}

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

    return res.json(await withActors(notifications));
  } catch (err) {
    return res.status(500).json({
      message: "Failed",
    });
  }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await prisma.notification.update({
      where: {
        id: notification.id,
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
