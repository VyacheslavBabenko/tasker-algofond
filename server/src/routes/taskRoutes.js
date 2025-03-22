import express from "express";
import * as taskController from "../controllers/taskController.js";
import * as subtaskController from "../controllers/subtaskController.js";

const router = express.Router();

// Маршруты для задач
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.post("/reorder", taskController.reorderTasks);

// Маршруты для подзадач
router.get("/:taskId/subtasks", subtaskController.getSubtasksByTaskId);
router.get("/subtasks/:id", subtaskController.getSubtaskById);
router.post("/subtasks", subtaskController.createSubtask);
router.put("/subtasks/:id", subtaskController.updateSubtask);
router.delete("/subtasks/:id", subtaskController.deleteSubtask);

export default router;
