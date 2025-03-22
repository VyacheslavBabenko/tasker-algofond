import { Task, SubTask } from "../models/index.js";

// Получить все задачи с подзадачами
export const getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.findAll({
			include: [
				{
					model: SubTask,
					as: "subTasks",
				},
			],
			order: [
				["order", "ASC"],
				["createdAt", "DESC"],
			],
		});

		return res.status(200).json(tasks);
	} catch (error) {
		console.error("Ошибка при получении задач:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось получить задачи",
		});
	}
};

// Получить одну задачу по ID
export const getTaskById = async (req, res) => {
	try {
		const { id } = req.params;

		const task = await Task.findByPk(id, {
			include: [
				{
					model: SubTask,
					as: "subTasks",
				},
			],
		});

		if (!task) {
			return res.status(404).json({
				error: true,
				message: "Задача не найдена",
			});
		}

		return res.status(200).json(task);
	} catch (error) {
		console.error("Ошибка при получении задачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось получить задачу",
		});
	}
};

// Создать новую задачу
export const createTask = async (req, res) => {
	try {
		const { date, result, object, task, status, statusLabel, assignee } =
			req.body;

		// Получить максимальный текущий порядок
		const maxOrderTask = await Task.findOne({
			order: [["order", "DESC"]],
		});

		const newOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

		const newTask = await Task.create({
			date,
			result,
			object,
			task,
			status,
			statusLabel,
			assignee,
			order: newOrder,
		});

		return res.status(201).json(newTask);
	} catch (error) {
		console.error("Ошибка при создании задачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось создать задачу",
			details: error.message,
		});
	}
};

// Обновить существующую задачу
export const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const task = await Task.findByPk(id);

		if (!task) {
			return res.status(404).json({
				error: true,
				message: "Задача не найдена",
			});
		}

		await task.update(updateData);

		// Получить обновленную задачу с подзадачами
		const updatedTask = await Task.findByPk(id, {
			include: [
				{
					model: SubTask,
					as: "subTasks",
				},
			],
		});

		return res.status(200).json(updatedTask);
	} catch (error) {
		console.error("Ошибка при обновлении задачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось обновить задачу",
		});
	}
};

// Удалить задачу
export const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;

		const task = await Task.findByPk(id);

		if (!task) {
			return res.status(404).json({
				error: true,
				message: "Задача не найдена",
			});
		}

		await task.destroy();

		return res.status(200).json({
			success: true,
			message: "Задача успешно удалена",
		});
	} catch (error) {
		console.error("Ошибка при удалении задачи:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось удалить задачу",
		});
	}
};

// Изменить порядок задач
export const reorderTasks = async (req, res) => {
	try {
		const { taskId, startIndex, endIndex } = req.body;

		// Находим задачу, которую нужно переместить
		const taskToMove = await Task.findByPk(taskId);

		if (!taskToMove) {
			return res.status(404).json({
				error: true,
				message: "Задача не найдена",
			});
		}

		// Получаем все задачи, отсортированные по порядку
		const allTasks = await Task.findAll({
			order: [["order", "ASC"]],
		});

		// Обновляем порядок задач
		if (startIndex < endIndex) {
			// Движение вниз: уменьшаем order для задач между startIndex и endIndex
			for (let i = 0; i < allTasks.length; i++) {
				const task = allTasks[i];
				if (task.order > taskToMove.order && task.order <= endIndex) {
					await task.update({ order: task.order - 1 });
				}
			}
		} else {
			// Движение вверх: увеличиваем order для задач между endIndex и startIndex
			for (let i = 0; i < allTasks.length; i++) {
				const task = allTasks[i];
				if (task.order >= endIndex && task.order < taskToMove.order) {
					await task.update({ order: task.order + 1 });
				}
			}
		}

		// Обновляем порядок перемещаемой задачи
		await taskToMove.update({ order: endIndex });

		// Получаем обновленный список задач
		const updatedTasks = await Task.findAll({
			include: [
				{
					model: SubTask,
					as: "subTasks",
				},
			],
			order: [["order", "ASC"]],
		});

		return res.status(200).json(updatedTasks);
	} catch (error) {
		console.error("Ошибка при изменении порядка задач:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось изменить порядок задач",
		});
	}
};
