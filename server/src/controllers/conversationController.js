const prisma = require("../config/db");

const conversationInclude = {
  participants: {
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          bio: true,
        },
      },
    },
  },

  messages: {
    orderBy: {
      createdAt: "desc",
    },

    take: 1,

    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  },
};

function conversationActivityTime(conversation) {
  return new Date(
    conversation.messages?.[0]?.createdAt || conversation.createdAt
  ).getTime();
}

function getPeerId(conversation, currentUserId) {
  return conversation.participants?.find(
    (participant) => participant.userId !== currentUserId
  )?.userId;
}

function uniqueConversationsByPeer(conversations, currentUserId) {
  const seen = new Set();

  return [...conversations]
    .sort((a, b) => conversationActivityTime(b) - conversationActivityTime(a))
    .filter((conversation) => {
      const peerId = getPeerId(conversation, currentUserId);

      if (!peerId || seen.has(peerId)) {
        return false;
      }

      seen.add(peerId);
      return true;
    });
}

exports.listConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: req.user.id,
          },
        },
      },

      include: conversationInclude,

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(uniqueConversationsByPeer(conversations, req.user.id));
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Conversations failed",
    });
  }
};

exports.startConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || userId === req.user.id) {
      return res.status(400).json({
        message: "Choose another user",
      });
    }

    const target = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
      },
    });

    if (!target) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find existing conversation
    const existing = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: req.user.id,
              },
            },
          },

          {
            participants: {
              some: {
                userId,
              },
            },
          },
        ],
      },

      include: conversationInclude,
    });

    if (existing.length) {
      return res.json(uniqueConversationsByPeer(existing, req.user.id)[0]);
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: req.user.id,
            },

            {
              userId,
            },
          ],
        },
      },

      include: conversationInclude,
    });

    return res.json(conversation);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Conversation failed",
    });
  }
};
