const axios = require("axios");

async function getZoomAccessToken() {
  try {
    const auth = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString("base64");

    const body = new URLSearchParams();

    body.append("grant_type", "account_credentials");

    body.append("account_id", process.env.ZOOM_ACCOUNT_ID);

    const res = await axios.post(
      "https://zoom.us/oauth/token",

      body.toString(),

      {
        headers: {
          Authorization: `Basic ${auth}`,

          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("TOKEN OK");

    return res.data.access_token;
  } catch (err) {
    console.log("TOKEN ERROR ↓");

    console.log(err.response?.data || err.message);

    throw err;
  }
}

async function createMeeting({ title, description }) {
  try {
    const token = await getZoomAccessToken();

    const res = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",

      {
        topic: title,

        agenda: description,

        type: 2,

        settings: {
          host_video: true,

          participant_video: true,

          join_before_host: true,
        },
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      }
    );

    console.log("MEETING CREATED");

    return {
      meetingId: String(res.data.id),

      joinUrl: res.data.join_url,
    };
  } catch (err) {
    console.log("MEETING ERROR ↓");

    console.log(err.response?.data || err.message);

    throw err;
  }
}

module.exports = {
  createMeeting,
};
