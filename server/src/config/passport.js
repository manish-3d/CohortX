const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const GithubStrategy = require("passport-github2").Strategy;

const prisma = require("./db");
const hasGithubCredentials =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "User not found",
          });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Please continue with GitHub",
          });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, {
            message: "Wrong password",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
if (hasGithubCredentials) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,

        clientSecret: process.env.GITHUB_CLIENT_SECRET,

        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          `${process.env.API_URL || "http://localhost:5000"}/auth/github/callback`,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.find((item) => item.primary)?.value ||
            profile.emails?.[0]?.value ||
            `${profile.id}@github.local`;

          let user = await prisma.user.findUnique({
            where: {
              githubId: profile.id,
            },
          });

          if (!user && email) {
            user = await prisma.user.findUnique({
              where: {
                email,
              },
            });

            if (user) {
              user = await prisma.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  githubId: profile.id,
                  githubUsername: profile.username,
                  avatar: user.avatar || profile.photos?.[0]?.value,
                },
              });
            }
          }

          if (!user) {
            const baseUsername = profile.username || `github-${profile.id}`;
            let username = baseUsername;
            let suffix = 1;

            while (
              await prisma.user.findUnique({
                where: {
                  username,
                },
              })
            ) {
              username = `${baseUsername}-${suffix}`;
              suffix += 1;
            }

            user = await prisma.user.create({
              data: {
                githubId: profile.id,

                username,

                email,

                password: null,

                avatar: profile.photos?.[0]?.value,

                githubUsername: profile.username,
              },
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
