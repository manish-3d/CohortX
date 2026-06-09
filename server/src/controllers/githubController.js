const { getGithubUser } = require("../services/githubService");

function normalizeContributions(contributions) {
  const rawDays = Array.isArray(contributions?.contributions)
    ? contributions.contributions
    : [];

  const days = rawDays.flatMap((entry) => {
    if (Array.isArray(entry?.days)) {
      return entry.days;
    }

    if (entry?.date) {
      return [entry];
    }

    return [];
  });

  return days
    .filter((day) => day?.date)
    .map((day) => ({
      date: day.date,

      count: Number(day.count) || 0,

      level: Number(day.level) || 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

exports.getGithubProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const data = await getGithubUser(username);

    const days = normalizeContributions(data.contributions);

    return res.json({
      login: data.profile.login,

      repos: data.profile.public_repos,

      followers: data.profile.followers,

      following: data.profile.following,

      heatmap: days,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Github fetch failed",
    });
  }
};
