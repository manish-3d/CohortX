const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, logout, me } = require("../controllers/authController");

const router = express.Router();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET ||
      process.env.SESSION_SECRET ||
      "cohortx-dev-jwt-secret",
    {
      expiresIn: "30d",
    }
  );
}

function safeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...rest } = user;
  return rest;
}

function ensureGithubConfigured(req, res, next) {
  if (!passport._strategy("github")) {
    return res.status(503).json({
      message: "GitHub login is not configured",
    });
  }

  return next();
}

router.post("/register", register);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        user: safeUser(user),
        token: signToken(user),
      });
    });
  })(req, res, next);
});
router.get(
  "/github",

  ensureGithubConfigured,

  passport.authenticate(
    "github",

    {
      scope: ["user:email"],
    }
  )
);

router.get(
  "/github/callback",

  passport.authenticate(
    "github",

    {
      session: false,
      failureRedirect: `${clientUrl}/login`,
    }
  ),

  async (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user.id,
        },

        process.env.JWT_SECRET ||
          process.env.SESSION_SECRET ||
          "cohortx-dev-jwt-secret",

        {
          expiresIn: "30d",
        }
      );

      res.redirect(`${clientUrl}/oauth-success?token=${token}`);
    } catch {
      res.redirect(`${clientUrl}/login`);
    }
  }
);

router.post("/logout", logout);

router.get("/me", me);

module.exports = router;
