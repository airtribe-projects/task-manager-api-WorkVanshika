const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
  getTasksByPriority,
} = require("../controller/tasksController");
const router = express.Router();

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.post("/", createTask);

router.put("/:id", updateTaskById);

router.delete("/:id", deleteTaskById);

router.get("/priority/:level", getTasksByPriority);

module.exports = { router };
