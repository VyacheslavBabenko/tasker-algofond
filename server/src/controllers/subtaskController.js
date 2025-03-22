import { Task, SubTask } from "../models/index.js";

// Получить все подзадачи для задачи
export const getSubtasksByTaskId = async (req, res) => {
	try {
		const { taskId } = req.params;

		const task = await Task.findByPk(taskId);

		if (!task) {
			return res.status(404).json({
				error: true,
				message: "Задача не найдена",
			});
		}

		const subtasks = await SubTask.findAll({
			where: { taskId },
			order: [["createdAt", "ASC"]],
		});

		return res.status(200).json(subtasks);
	} catch (error) {
		console.error("Ошибка при получении подзадач:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось получить подзадачи",
		});
	}
};

// Получить подзадачу по ID
export const getSubtaskById = async (req, res) => {
	try {
		const { id } = req.params;

		const subtask = await SubTask.findByPk(id);

		if (!subtask) {
			return res.status(404).json({
				error: true,
				message: "Подзадача не найдена",
			});
		}

		return res.status(200).json(subtask);
	} catch (error) {
		console.error("Ошибка при получении подзадачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось получить подзадачу",
		});
	}
};

// Создать новую подзадачу
export const createSubtask = async (req, res) => {
	try {
		const { taskId, object, description, status, statusLabel, assignee } =
			req.body;

		// Проверяем существование задачи
		const task = await Task.findByPk(taskId);

		if (!task) {
			return res.status(404).json({
				error: true,
				message: "Задача не найдена",
			});
		}

		const newSubtask = await SubTask.create({
			taskId,
			object,
			description,
			status,
			statusLabel,
			assignee,
		});

		return res.status(201).json(newSubtask);
	} catch (error) {
		console.error("Ошибка при создании подзадачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось создать подзадачу",
		});
	}
};

// Обновить существующую подзадачу
export const updateSubtask = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const subtask = await SubTask.findByPk(id);

		if (!subtask) {
			return res.status(404).json({
				error: true,
				message: "Подзадача не найдена",
			});
		}

		await subtask.update(updateData);

		return res.status(200).json(subtask);
	} catch (error) {
		console.error("Ошибка при обновлении подзадачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось обновить подзадачу",
		});
	}
};

// Удалить подзадачу
export const deleteSubtask = async (req, res) => {
	try {
		const { id } = req.params;

		const subtask = await SubTask.findByPk(id);

		if (!subtask) {
			return res.status(404).json({
				error: true,
				message: "Подзадача не найдена",
			});
		}

		await subtask.destroy();

		return res.status(200).json({
			success: true,
			message: "Подзадача успешно удалена",
		});
	} catch (error) {
		console.error("Ошибка при удалении подзадачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось удалить подзадачу",
		});
	}
};
