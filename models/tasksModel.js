const tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
    priority: "high",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Write documentation",
    description: "Document the API endpoints",
    completed: false,
    priority: "low",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Fix bugs",
    description: "Resolve issues in the task manager",
    completed: false,
    priority: "medium",
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "Deploy application",
    description: "Deploy the task manager to production",
    completed: false,
    priority: "high",
    createdAt: new Date(),
  },
];

module.exports = { tasks };
