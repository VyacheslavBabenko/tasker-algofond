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
	subTasks?: SubTask[];
	order?: number;
}

interface TaskContextType {
	tasks: Task[];
	filteredTasks: Task[];
	activeFilter: string;
	searchTerm: string;
	isLoading: boolean;
	setSearchTerm: (term: string) => void;
	setFilter: (filter: string) => void;
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
}

// API URL
const API_URL = "http://localhost:3001/api";

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
	const [activeFilter, setActiveFilter] = useState<string>("Все");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Загрузка задач при монтировании компонента
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				setIsLoading(true);
				const data = await fetchAPI("/tasks");
				setTasks(data);
			} catch (error) {
				console.error("Ошибка при загрузке задач:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTasks();
	}, []);

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

			if (!matchesSearch) return false;

			if (activeFilter === "Все") return true;
			if (activeFilter === task.date) return true;
			if (activeFilter === task.assignee) return true;

			if (task.subTasks) {
				return task.subTasks.some(
					(subTask) => subTask.assignee === activeFilter
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
			const newTask = await fetchAPI("/tasks", {
				method: "POST",
				body: JSON.stringify(task),
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

			// Оптимистичное обновление UI
			const result = Array.from(tasks);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);

			// Обновляем порядок в UI
			setTasks(result.map((task, index) => ({ ...task, order: index })));

			// Отправляем запрос на сервер
			const updatedTasks = await fetchAPI("/tasks/reorder", {
				method: "POST",
				body: JSON.stringify({ taskId, startIndex, endIndex }),
			});

			// Обновляем состояние после ответа сервера
			setTasks(updatedTasks);
		} catch (error) {
			console.error("Ошибка при изменении порядка задач:", error);

			// Загружаем актуальное состояние с сервера
			const data = await fetchAPI("/tasks");
			setTasks(data);

			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TaskContext.Provider
			value={{
				tasks,
				filteredTasks,
				activeFilter,
				searchTerm,
				isLoading,
				setSearchTerm,
				setFilter,
				addTask,
				updateTask,
				updateSubTask,
				deleteTask,
				addSubTask,
				reorderTasks,
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
