const { tasks } = require("../models/tasksModel");

const validateTaskInput = (task) => {
  if (
    !task.title ||
    typeof task.title !== "string" ||
    task.title.trim() === ""
  ) {
    return { valid: false, message: "Title must be a non-empty string." };
  }
  if (
    !task.description ||
    typeof task.description !== "string" ||
    task.description.trim() === ""
  ) {
    return { valid: false, message: "Description must be a non-empty string." };
  }
  if (task.completed !== undefined && typeof task.completed !== "boolean") {
    return { valid: false, message: "Completed must be a boolean value." };
  }
  if (task.priority && !["low", "medium", "high"].includes(task.priority)) {
    return {
      valid: false,
      message: "Priority must be one of 'low', 'medium', or 'high'.",
    };
  }
  return { valid: true };
};

const createTask = (req, res) => {
  const task = req.body;
  const validation = validateTaskInput(task);
  if (!validation.valid) {
    return res.status(400).send({ message: validation.message });
  }
  task.completed = task.completed ?? false;
  task.priority = task.priority ?? "low";
  task.createdAt = new Date();
  task.id = tasks.length + 1;
  tasks.push(task);
  res.status(201).send(task);
};

const getTasks = (req, res) => {
  let filteredTasks = tasks;

  if (req.query.completed !== undefined) {
    const completed = req.query.completed === "true";
    filteredTasks = filteredTasks.filter(
      (task) => task.completed === completed
    );
  }

  if (req.query.sortBy === "createdAt") {
    filteredTasks = filteredTasks.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  res.status(200).send(filteredTasks);
};

const getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (!task) return res.status(404).send({ message: "Task Not Found" });
  res.status(200).send(task);
};

const getTasksByPriority = (req, res) => {
  const priorityLevel = req.params.level;
  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priorityLevel))
    return res.status(400).send({ message: "Invalid priority level." });

  const filteredTasks = tasks.filter((task) => task.priority === priorityLevel);
  res.send(filteredTasks);
};

const updateTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (!task) return res.status(404).send({ message: "Task Not Found" });

  const updatedTask = req.body;
  const validation = validateTaskInput(updatedTask);
  if (!validation.valid) {
    return res.status(400).send({ message: validation.message });
  }

  task.title = updatedTask.title ?? task.title;
  task.description = updatedTask.description ?? task.description;
  task.completed = updatedTask.completed ?? task.completed;
  task.priority = updatedTask.priority ?? task.priority;
  res.status(200).send(task);
};

const deleteTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1)
    return res.status(404).send({ message: "Task Not Found" });

  tasks.splice(taskIndex, 1);
  res.status(200).send({ message: "Task Deleted Successfully" });
};

module.exports = {
  getTasks,
  getTaskById,
  getTasksByPriority,
  createTask,
  updateTaskById,
  deleteTaskById,
};
