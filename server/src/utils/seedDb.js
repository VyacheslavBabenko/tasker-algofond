import { Task, SubTask, Project } from "../models/index.js";
import sequelize from "../config/database.js";
import { fileURLToPath } from "url";

const initialProjects = [
	{
		id: "project-1",
		name: "Основной проект",
		description: "Первый проект команды",
		createdAt: new Date(2023, 2, 15),
		tasksCount: 12,
	},
];

const initialTasks = [
	{
		id: "4",
		date: "Март",
		result: "Доходность",
		object: "Робот MVP",
		task: "Плановый доход в час",
		status: "inProgress",
		statusLabel: "В работе",
		assignee: "Дима",
		order: 0,
		projectId: "project-1",
		subTasks: [
			{
				object: "Рейтинг",
				description: "Обновить имена таблиц как в мускуле 001 и т.д.",
				status: "take",
				statusLabel: "Взять",
				assignee: "Женя",
			},
			{
				object: "Таскер",
				description:
					"Когда в стейте что то вычитается для получечния 0, то прям записывать 0, иначе флоат оставит 0.00000001",
				status: "take",
				statusLabel: "Взять",
				assignee: "Саша",
			},
		],
	},
	{
		id: "13",
		date: "Март",
		result: "Просадка",
		object: "chart_api",
		task: "Создать 10 алгоритмов",
		status: "check",
		statusLabel: "Проверить",
		assignee: "Денис",
		order: 1,
		projectId: "project-1",
	},
	{
		id: "16",
		date: "Март",
		result: "Порядок",
		object: "Внедрить индикаторы",
		task: "Вывод из просадки другими алгоритмами",
		status: "blocked",
		statusLabel: "Блок софта",
		assignee: "Дэ Хан",
		order: 2,
		projectId: "project-1",
	},
	{
		id: "23",
		date: "Март",
		result: "Просадка",
		object: "chart_api",
		task: "Создать 10 алгоритмов",
		status: "check",
		statusLabel: "Проверить",
		assignee: "Денис",
		order: 3,
		projectId: "project-1",
	},
	{
		id: "33",
		date: "Март",
		result: "Просадка",
		object: "chart_api",
		task: "Создать 10 алгоритмов",
		status: "check",
		statusLabel: "Проверить",
		assignee: "Денис",
		order: 4,
		projectId: "project-1",
	},
	{
		id: "43",
		date: "Март",
		result: "Просадка",
		object: "chart_api",
		task: "Создать 10 алгоритмов",
		status: "check",
		statusLabel: "Проверить",
		assignee: "Денис",
		order: 5,
		projectId: "project-1",
	},
	{
		id: "53",
		date: "Март",
		result: "Просадка",
		object: "chart_api",
		task: "Создать 10 алгоритмов",
		status: "check",
		statusLabel: "Проверить",
		assignee: "Денис",
		order: 6,
		projectId: "project-1",
	},
	{
		id: "63",
		date: "Март",
		result: "Просадка",
		object: "chart_api",
		task: "Создать 10 алгоритмов",
		status: "check",
		statusLabel: "Проверить",
		assignee: "Денис",
		order: 7,
		projectId: "project-1",
	},
];

const seedDatabase = async () => {
	try {
		console.log("Начинаю заполнение базы данных...");

		// Сбрасываем и синхронизируем модели с базой данных
		await sequelize.sync({ force: true });
		console.log("База данных очищена и схемы созданы заново");

		// Создаем проекты
		for (const projectData of initialProjects) {
			await Project.create(projectData);
		}
		console.log("Проекты созданы");

		// Создаем задачи
		for (const taskData of initialTasks) {
			const { subTasks, ...taskOnly } = taskData;
			const task = await Task.create(taskOnly);

			// Если есть подзадачи, создаем их
			if (subTasks && subTasks.length > 0) {
				for (const subtaskData of subTasks) {
					await SubTask.create({
						...subtaskData,
						taskId: task.id,
					});
				}
			}
		}

		console.log("База данных успешно заполнена");

		return true;
	} catch (error) {
		console.error("Ошибка при заполнении базы данных:", error);
		return false;
	} finally {
		// Закрываем соединение
		await sequelize.close();
	}
};

// Если файл запущен напрямую, выполняем заполнение
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	seedDatabase()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}

export default seedDatabase;
