import express from "express";
import {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Получить все проекты
router.get("/", getAllProjects);

// Получить проект по ID
router.get("/:id", getProjectById);

// Создать новый проект
router.post("/", createProject);

// Обновить проект
router.put("/:id", updateProject);

// Удалить проект
router.delete("/:id", deleteProject);

export default router;
