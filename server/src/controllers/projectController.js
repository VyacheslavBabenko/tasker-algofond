import { Project, Task } from "../models/index.js";

// Получить все проекты
export const getAllProjects = async (req, res) => {
	try {
		const projects = await Project.findAll({
			order: [["createdAt", "DESC"]],
		});

		// Для каждого проекта подсчитаем количество связанных задач
		const projectsWithTaskCount = await Promise.all(
			projects.map(async (project) => {
				const tasksCount = await Task.count({
					where: { projectId: project.id },
				});
				return {
					...project.toJSON(),
					tasksCount,
				};
			})
		);

		return res.status(200).json(projectsWithTaskCount);
	} catch (error) {
		console.error("Ошибка при получении проектов:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось получить проекты",
			details: error.message,
		});
	}
};

// Получить проект по ID
export const getProjectById = async (req, res) => {
	try {
		const { id } = req.params;
		const project = await Project.findByPk(id);

		if (!project) {
			return res.status(404).json({
				error: true,
				message: "Проект не найден",
			});
		}

		// Подсчитываем количество задач для проекта
		const tasksCount = await Task.count({
			where: { projectId: id },
		});

		const projectWithTasksCount = {
			...project.toJSON(),
			tasksCount,
		};

		return res.status(200).json(projectWithTasksCount);
	} catch (error) {
		console.error(`Ошибка при получении проекта с ID ${req.params.id}:`, error);
		return res.status(500).json({
			error: true,
			message: "Не удалось получить проект",
			details: error.message,
		});
	}
};

// Создать новый проект
export const createProject = async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name) {
			return res.status(400).json({
				error: true,
				message: "Название проекта обязательно для заполнения",
			});
		}

		const projectId = `project-${Date.now()}`;
		const newProject = await Project.create({
			id: projectId,
			name,
			description,
			tasksCount: 0,
		});

		return res.status(201).json(newProject);
	} catch (error) {
		console.error("Ошибка при создании проекта:", error);
		return res.status(500).json({
			error: true,
			message: "Не удалось создать проект",
			details: error.message,
		});
	}
};

// Обновить проект
export const updateProject = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const project = await Project.findByPk(id);
		if (!project) {
			return res.status(404).json({
				error: true,
				message: "Проект не найден",
			});
		}

		// Обновляем проект
		await project.update(updateData);

		// Подсчитываем количество задач для проекта
		const tasksCount = await Task.count({
			where: { projectId: id },
		});

		const updatedProject = {
			...project.toJSON(),
			tasksCount,
		};

		return res.status(200).json(updatedProject);
	} catch (error) {
		console.error(
			`Ошибка при обновлении проекта с ID ${req.params.id}:`,
			error
		);
		return res.status(500).json({
			error: true,
			message: "Не удалось обновить проект",
			details: error.message,
		});
	}
};

// Удалить проект
export const deleteProject = async (req, res) => {
	try {
		const { id } = req.params;

		const project = await Project.findByPk(id);
		if (!project) {
			return res.status(404).json({
				error: true,
				message: "Проект не найден",
			});
		}

		// Проверка, есть ли задачи в проекте
		const tasksCount = await Task.count({ where: { projectId: id } });

		if (tasksCount > 0) {
			return res.status(400).json({
				error: true,
				message: "Невозможно удалить проект, содержащий задачи",
			});
		}

		await project.destroy();

		return res.status(200).json({
			success: true,
			message: "Проект успешно удален",
		});
	} catch (error) {
		console.error(`Ошибка при удалении проекта с ID ${req.params.id}:`, error);
		return res.status(500).json({
			error: true,
			message: "Не удалось удалить проект",
			details: error.message,
		});
	}
};
