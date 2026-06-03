const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  exploreProjects
} = require("../controllers/projectController");

const {
  isAuthenticated,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProjects);
router.get("/explore",isAuthenticated, exploreProjects);
router.get("/:id", getProject);

router.post(
  "/",
  isAuthenticated,
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