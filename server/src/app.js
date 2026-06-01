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

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", likeRoutes);
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