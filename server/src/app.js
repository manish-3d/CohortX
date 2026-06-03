const express = require("express");
const cors = require("cors");
const session = require("express-session");

const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require("./routes/followRoutes");
const feedRoutes = require("./routes/feedRoutes");
const fileUpload = require("express-fileupload");
const uploadRoutes =
require(
"./routes/uploadRoutes"
);
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(express.json());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials:
      true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  })
);

app.use(
  session({
    secret:
      process.env
        .SESSION_SECRET ||
      "cohortx-dev-session-secret",

    resave:
      false,

    saveUninitialized:
      false,

    cookie: {
      secure:
        false,

      httpOnly:
        true,

      maxAge:
        1000 *
        60 *
        60 *
        24,
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/projects", likeRoutes);
app.use("/projects", commentRoutes);
app.use("/users",followRoutes);
app.use("/feed",feedRoutes);
app.use(fileUpload({useTempFiles:true}));
app.use("/uplad",uploadRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "CohortX API Running",
  });
});

module.exports = app;
