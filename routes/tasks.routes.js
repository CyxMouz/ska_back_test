const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/Tasks.controller");
const authMidll = require("../middleware/authMiddleware");
router.get("/", [authMidll], tasksController.getAllTasks);
router.post("/", [authMidll], tasksController.addTask);
router.put("/:id/complete", [authMidll], tasksController.markTaskAsComplete);
router.get("/count-tasks-single", [authMidll], tasksController.countTask);
router.get("/count-tasks-grouped", [authMidll], tasksController.getTasksByDate);
router.get("/task-metric", [authMidll], tasksController.getTasksRate);
router.get("/task-range", [authMidll], tasksController.getTasksInDateRange);

// Not implemented in the front
router.get("/count-tasks-admin", [authMidll], tasksController.countTasksAdmin);
// router.get("/task-rate-month", tasksController.getTasksRateByMonth);
module.exports = router;
