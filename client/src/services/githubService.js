const axios =
  require("axios");

async function getGithubUser(
  username
) {
  const res =
    await axios.get(
      `https://api.github.com/users/${username}`
    );

  return res.data;
}

module.exports = {
  getGithubUser,
};