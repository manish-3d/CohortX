const prisma = require("../config/db");

const { createMeeting } = require("../services/zoomService");

exports.startLive = async (req, res) => {
  try {
    const { title, description } = req.body;

    const zoom = await createMeeting({
      title,
      description,
    });

    const live = await prisma.live.create({
      data: {
        title,

        description,

        hostId: req.user.id,

        zoomMeetingId: zoom.meetingId,

        zoomJoinUrl: zoom.joinUrl,

        recordingUrl: null,

        viewerCount: 0,

        isLive: true,

        startedAt: new Date(),
      },

      include: {
        host: {
          select: {
            id: true,

            username: true,

            avatar: true,
          },
        },
      },
    });

    return res.status(201).json(live);
  } catch (err) {
    console.log("FULL ERROR ↓");

    console.log(err.response?.data || err.message || err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateViewer = async (req, res) => {
  try {
    const { change } = req.body;

    const updated = await prisma.live.update({
      where: {
        id: req.params.id,
      },

      data: {
        viewerCount: {
          increment: Number(change),
        },
      },

      select: {
        id: true,

        viewerCount: true,
      },
    });

    console.log("VIEWERS:", updated.viewerCount);

    return res.json(updated);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getLives = async (req, res) => {
  try {
    const lives = await prisma.live.findMany({
      where: {
        isLive: true,
      },

      include: {
        host: {
          select: {
            id: true,

            username: true,

            avatar: true,
          },
        },
      },

      orderBy: {
        startedAt: "desc",
      },
    });

    return res.json(lives);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.endLive = async (req, res) => {
  try {
    const live = await prisma.live.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!live) {
      return res.status(404).json({
        message: "Live not found",
      });
    }

    if (live.hostId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updated = await prisma.live.update({
      where: {
        id: req.params.id,
      },

      data: {
        isLive: false,

        endedAt: new Date(),
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.attachRecording = async (req, res) => {
  try {
    const { recordingUrl } = req.body;

    const updated = await prisma.live.update({
      where: {
        id: req.params.id,
      },

      data: {
        recordingUrl,
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
