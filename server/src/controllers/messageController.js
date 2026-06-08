
const prisma =
  require(
    "../config/db"
  );

const messageInclude = {
  sender: {
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  },
};

async function findParticipantConversation(
  conversationId,
  userId
) {
  return prisma.conversation.findFirst({
    where: {
      id:
        conversationId,

      participants: {
        some: {
          userId,
        },
      },
    },
  });
}

exports.sendMessage =
  async (
    req,
    res
  ) => {
    try {
     const {

text,

conversationId,

}=
req.body;

      if (
        !text?.trim() ||
        !conversationId
      ) {
        return res
          .status(400)
          .json({
            message:
              "Message required",
          });
      }

      const conversation =
        await findParticipantConversation(
          conversationId,
          req.user.id
        );

      if (
        !conversation
      ) {
        return res
          .status(404)
          .json({
            message:
              "Conversation not found",
          });
      }

      const message =
        await prisma.message.create({
data:{

text:
text.trim(),

senderId:
req.user.id,

conversationId,

},

include:
messageInclude,
        });

      return res
        .json(
          message
        );

    } catch (
      err
    ) {
      return res
        .status(500)
        .json({
          message:
            "Send failed",
        });
    }
  };

exports.getMessages =
async (

  req,
  res

) => {

  try {

    const {
      conversationId,
    } =
      req.params;

    const conversation =
      await findParticipantConversation(
        conversationId,
        req.user.id
      );

    if (
      !conversation
    ) {
      return res
        .status(404)
        .json({
          message:
            "Conversation not found",
        });
    }

    const messages =

      await prisma
      .message
      .findMany({

        where: {

          conversationId,

        },

        orderBy: {

          createdAt:
            "asc",

        },

        include:
          messageInclude,

      });

    return res
      .json(
        messages
      );

  }

  catch (

    err

  ) {

    console.log(
      err
    );

    return res
      .status(
        500
      )
      .json({

        message:
          "Load failed",

      });

  }

};
  exports.createMessage =
async (

  req,
  res

) => {

  try {

    const {

      text,

      conversationId,

    } =
      req.body;

    const conversation =
      await findParticipantConversation(
        conversationId,
        req.user.id
      );

    if (
      !conversation
    ) {
      return res
        .status(404)
        .json({
          message:
            "Conversation not found",
        });
    }

    const message =

      await prisma
      .message
      .create({

        data: {

          text:
            text.trim(),

          senderId:
            req.user.id,

          conversationId,

        },

        include:
          messageInclude,

      });

    return res
      .json(
        message
      );

  }

  catch (

    err

  ) {

    console.log(
      err
    );

    return res
      .status(
        500
      )
      .json({

        message:
          "Send failed",

      });

  }

};
