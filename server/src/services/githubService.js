const axios =
  require("axios");

async function getGithubUser(
  username
) {
  const profile =
    await axios.get(
      `https://api.github.com/users/${username}`
    );

  const contributions =
    await axios.get(
      `https://github-contributions-api.jogruber.de/v4/${username}`
    );

  return {
    profile:
      profile.data,

    contributions:
      contributions.data,
  };
}

module.exports = {
  getGithubUser,
};