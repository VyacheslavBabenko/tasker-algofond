import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

type StatusType = "inProgress" | "take" | "check" | "blocked";

export interface SubTask {
	id: string;
	object: string;
	description: string;
	status: StatusType;
	statusLabel: string;
	assignee: string;
}

export interface Task {
	id: string;
	date: string;
	result: string;
	object: string;
	task: string;
	status: StatusType;
	statusLabel: string;
	assignee: string;
	projectId?: string;
	subTasks?: SubTask[];
	order?: number;
}

export interface TeamMember {
	id: string;
	name: string;
	role: string;
	email?: string;
	avatar?: string;
}

interface TaskContextType {
	tasks: Task[];
	filteredTasks: Task[];
	teamMembers: TeamMember[];
	activeFilter: string;
	searchTerm: string;
	isLoading: boolean;
	currentProjectId: string | null;
	setSearchTerm: (term: string) => void;
	setFilter: (filter: string) => void;
	setCurrentProjectId: (projectId: string | null) => void;
	addTask: (task: Omit<Task, "id">) => Promise<void>;
	updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
	updateSubTask: (
		taskId: string,
		subTaskId: string,
		updatedSubTask: Partial<SubTask>
	) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	addSubTask: (taskId: string, subTask: Omit<SubTask, "id">) => Promise<void>;
	reorderTasks: (
		taskId: string,
		startIndex: number,
		endIndex: number
	) => Promise<void>;
	addTeamMember: (member: Omit<TeamMember, "id">) => Promise<void>;
	updateTeamMember: (
		id: string,
		updatedMember: Partial<TeamMember>
	) => Promise<void>;
	deleteTeamMember: (id: string) => Promise<void>;
	getTasksCountByProject: (projectId: string) => number;
}

// API URL
const API_URL =
	process.env.NODE_ENV === "production"
		? "http://167.172.39.56:3004/api"
		: "http://localhost:3004/api";

// Функция для выполнения API запросов
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
	try {
		const response = await fetch(`${API_URL}${endpoint}`, {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.message || "Произошла ошибка при запросе к API"
			);
		}

		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
		{ id: "1", name: "Дима", role: "Разработчик", email: "dima@example.com" },
		{ id: "2", name: "Денис", role: "Дизайнер", email: "denis@example.com" },
		{ id: "3", name: "Женя", role: "Менеджер", email: "zhenya@example.com" },
		{ id: "4", name: "Саша", role: "Разработчик", email: "sasha@example.com" },
		{ id: "5", name: "Дэ Хан", role: "Аналитик", email: "dehan@example.com" },
		{ id: "6", name: "Леша", role: "Тестировщик", email: "lesha@example.com" },
		{ id: "7", name: "Коля", role: "Разработчик", email: "kolya@example.com" },
	]);
	const [activeFilter, setActiveFilter] = useState<string>("Все");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [currentProjectId, setCurrentProjectId] = useState<string | null>(
		() => {
			// Восстанавливаем ID проекта из localStorage при инициализации
			const savedProjectId = localStorage.getItem("currentProjectId");
			return savedProjectId || "project-1";
		}
	);

	// Сохраняем ID текущего проекта в localStorage при его изменении
	useEffect(() => {
		if (currentProjectId) {
			localStorage.setItem("currentProjectId", currentProjectId);
		} else {
			localStorage.removeItem("currentProjectId");
		}
	}, [currentProjectId]);

	// Загрузка задач при монтировании компонента или изменении проекта
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				setIsLoading(true);
				const endpoint = currentProjectId
					? `/tasks?projectId=${encodeURIComponent(currentProjectId)}`
					: "/tasks";
				const data = await fetchAPI(endpoint);
				setTasks(data);
			} catch (error) {
				console.error("Ошибка при загрузке задач:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTasks();
	}, [currentProjectId]);

	const sortTasksByOrder = (tasksToSort: Task[]): Task[] => {
		return [...tasksToSort].sort((a, b) => {
			const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
			const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
			return orderA - orderB;
		});
	};

	const filteredTasks = sortTasksByOrder(
		tasks.filter((task) => {
			const matchesSearch =
				searchTerm === "" ||
				task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.assignee.toLowerCase().includes(searchTerm.toLowerCase());

			// Если указан конкретный проект, фильтруем задачи только этого проекта
			if (currentProjectId && task.projectId !== currentProjectId) {
				return false;
			}

			if (!matchesSearch) return false;

			if (activeFilter === "Все") return true;
			if (activeFilter === task.date) return true;
			if (activeFilter === task.assignee) return true;
			if (activeFilter === task.status) return true;
			if (activeFilter === task.statusLabel) return true;

			if (task.subTasks) {
				return task.subTasks.some(
					(subTask) =>
						subTask.assignee === activeFilter ||
						subTask.status === activeFilter ||
						subTask.statusLabel === activeFilter
				);
			}

			return false;
		})
	);

	const setFilter = (filter: string) => {
		setActiveFilter(filter);
	};

	const addTask = async (task: Omit<Task, "id">) => {
		try {
			setIsLoading(true);
			// Если указан текущий проект, добавляем его к задаче
			const taskWithProject = {
				...task,
				projectId: currentProjectId || "project-1",
			};

			const newTask = await fetchAPI("/tasks", {
				method: "POST",
				body: JSON.stringify(taskWithProject),
			});

			setTasks([...tasks, newTask]);
		} catch (error) {
			console.error("Ошибка при добавлении задачи:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const updateTask = async (id: string, updatedTask: Partial<Task>) => {
		try {
			setIsLoading(true);
			const updated = await fetchAPI(`/tasks/${id}`, {
				method: "PUT",
				body: JSON.stringify(updatedTask),
			});

			setTasks(tasks.map((task) => (task.id === id ? updated : task)));
		} catch (error) {
			console.error("Ошибка при обновлении задачи:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const updateSubTask = async (
		taskId: string,
		subTaskId: string,
		updatedSubTask: Partial<SubTask>
	) => {
		try {
			setIsLoading(true);
			const updated = await fetchAPI(`/tasks/subtasks/${subTaskId}`, {
				method: "PUT",
				body: JSON.stringify(updatedSubTask),
			});

			setTasks(
				tasks.map((task) => {
					if (task.id === taskId && task.subTasks) {
						return {
							...task,
							subTasks: task.subTasks.map((subTask) =>
								subTask.id === subTaskId ? { ...subTask, ...updated } : subTask
							),
						};
					}
					return task;
				})
			);

			// Обновляем полностью задачу, чтобы получить актуальные данные
			const updatedTask = await fetchAPI(`/tasks/${taskId}`);
			setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
		} catch (error) {
			console.error("Ошибка при обновлении подзадачи:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteTask = async (id: string) => {
		try {
			setIsLoading(true);
			await fetchAPI(`/tasks/${id}`, {
				method: "DELETE",
			});

			setTasks(tasks.filter((task) => task.id !== id));
		} catch (error) {
			console.error("Ошибка при удалении задачи:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const addSubTask = async (taskId: string, subTask: Omit<SubTask, "id">) => {
		try {
			setIsLoading(true);
			const newSubTask = await fetchAPI("/tasks/subtasks", {
				method: "POST",
				body: JSON.stringify({ ...subTask, taskId }),
			});

			setTasks(
				tasks.map((task) => {
					if (task.id === taskId) {
						return {
							...task,
							subTasks: [...(task.subTasks || []), newSubTask],
						};
					}
					return task;
				})
			);

			// Обновляем полностью задачу, чтобы получить актуальные данные
			const updatedTask = await fetchAPI(`/tasks/${taskId}`);
			setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
		} catch (error) {
			console.error("Ошибка при добавлении подзадачи:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const reorderTasks = async (
		taskId: string,
		startIndex: number,
		endIndex: number
	) => {
		try {
			setIsLoading(true);
			// Добавляем projectId при необходимости
			const reorderData = {
				taskId,
				startIndex,
				endIndex,
				projectId: currentProjectId || undefined,
			};

			const updatedTasks = await fetchAPI("/tasks/reorder", {
				method: "PUT",
				body: JSON.stringify(reorderData),
			});

			setTasks(updatedTasks);
		} catch (error) {
			console.error("Ошибка при изменении порядка задач:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Функция для добавления нового члена команды
	const addTeamMember = async (member: Omit<TeamMember, "id">) => {
		try {
			// В реальном приложении здесь был бы API запрос
			const newMember: TeamMember = {
				...member,
				id: `member_${Date.now()}`,
			};
			setTeamMembers([...teamMembers, newMember]);
			return Promise.resolve();
		} catch (error) {
			console.error("Ошибка при добавлении члена команды:", error);
			return Promise.reject(error);
		}
	};

	// Функция для обновления члена команды
	const updateTeamMember = async (
		id: string,
		updatedMember: Partial<TeamMember>
	) => {
		try {
			// В реальном приложении здесь был бы API запрос
			setTeamMembers(
				teamMembers.map((member) =>
					member.id === id ? { ...member, ...updatedMember } : member
				)
			);
			return Promise.resolve();
		} catch (error) {
			console.error("Ошибка при обновлении члена команды:", error);
			return Promise.reject(error);
		}
	};

	// Функция для удаления члена команды
	const deleteTeamMember = async (id: string) => {
		try {
			// В реальном приложении здесь был бы API запрос
			setTeamMembers(teamMembers.filter((member) => member.id !== id));
			return Promise.resolve();
		} catch (error) {
			console.error("Ошибка при удалении члена команды:", error);
			return Promise.reject(error);
		}
	};

	// Функция для получения количества задач для проекта
	const getTasksCountByProject = (projectId: string): number => {
		return tasks.filter((task) => task.projectId === projectId).length;
	};

	return (
		<TaskContext.Provider
			value={{
				tasks,
				filteredTasks,
				teamMembers,
				activeFilter,
				searchTerm,
				isLoading,
				currentProjectId,
				setSearchTerm,
				setFilter,
				setCurrentProjectId,
				addTask,
				updateTask,
				updateSubTask,
				deleteTask,
				addSubTask,
				reorderTasks,
				addTeamMember,
				updateTeamMember,
				deleteTeamMember,
				getTasksCountByProject,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export const useTask = () => {
	const context = useContext(TaskContext);
	if (context === undefined) {
		throw new Error("useTask must be used within a TaskProvider");
	}
	return context;
};
