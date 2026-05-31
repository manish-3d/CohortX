const express = require("express");
const passport = require("passport");

const {
  register,
  logout,
  me,
} = require("../controllers/authController");

const router = express.Router();

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

      return res.json({
        message: "Login successful",
        user,
      });
    });
  })(req, res, next);
});

router.post("/logout", logout);

router.get("/me", me);

module.exports = router;