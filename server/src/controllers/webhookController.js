const crypto = require("crypto");

const prisma = require("../config/db");

exports.zoomWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === "endpoint.url_validation") {
      const plainToken = payload.plainToken;

      const encryptedToken = crypto
        .createHmac("sha256", process.env.ZOOM_WEBHOOK_SECRET)
        .update(plainToken)
        .digest("hex");

      return res.status(200).json({
        plainToken,

        encryptedToken,
      });
    }

    const meetingId = String(payload?.object?.id);

    const live = await prisma.live.findFirst({
      where: {
        zoomMeetingId: meetingId,
      },
    });

    if (!live) {
      return res.status(200).send();
    }

    if (event === "meeting.participant_joined") {
      await prisma.live.update({
        where: {
          id: live.id,
        },

        data: {
          viewerCount: {
            increment: 1,
          },
        },
      });

      console.log("JOIN +1");
    }

    if (event === "meeting.participant_left") {
      await prisma.live.update({
        where: {
          id: live.id,
        },

        data: {
          viewerCount: {
            decrement: 1,
          },
        },
      });

      console.log("LEFT -1");
    }

    if (event === "meeting.ended") {
      await prisma.live.update({
        where: {
          id: live.id,
        },

        data: {
          isLive: false,

          endedAt: new Date(),
        },
      });

      console.log("LIVE ENDED");
    }

    return res.status(200).send();
  } catch (err) {
    console.log(err);

    return res.status(500).send();
  }
};
