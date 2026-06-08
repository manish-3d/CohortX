const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  exploreProjects
} = require("../controllers/projectController");

const upload= require("../config/upload");
const {
  isAuthenticated,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProjects);
router.get("/explore",isAuthenticated, exploreProjects);
router.get("/:id", isAuthenticated, getProject);

router.post(
  "/",
  isAuthenticated,
  upload.single("media"),
  createProject
);

router.put(
  "/:id",
  isAuthenticated,
  updateProject
);

router.delete(
  "/:id",
  isAuthenticated,
  deleteProject
);

module.exports = router;
