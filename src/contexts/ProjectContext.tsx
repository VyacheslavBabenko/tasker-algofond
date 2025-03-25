import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";

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

export interface Project {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	tasksCount: number;
}

interface ProjectContextType {
	projects: Project[];
	addProject: (name: string, description?: string) => Promise<Project>;
	updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
	deleteProject: (id: string) => Promise<void>;
	getProjectById: (id: string) => Project | undefined;
	recentProjects: Project[];
	addToRecentProjects: (projectId: string) => void;
}

// Максимальное количество недавних проектов для хранения
const MAX_RECENT_PROJECTS = 5;

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProjects() {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error("useProjects должен использоваться внутри ProjectProvider");
	}
	return context;
}

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { toast } = useToast();
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [recentProjects, setRecentProjects] = useState<Project[]>(() => {
		try {
			// Пытаемся восстановить из localStorage
			const savedRecentIds = localStorage.getItem("recentProjects");
			if (savedRecentIds) {
				return JSON.parse(savedRecentIds);
			}
		} catch (error) {
			console.error("Ошибка при загрузке недавних проектов:", error);
		}
		return [];
	});

	// Функция для добавления проекта в список недавно просмотренных
	const addToRecentProjects = (projectId: string) => {
		const project = getProjectById(projectId);
		if (!project) return;

		setRecentProjects((prev) => {
			// Удаляем проект, если он уже есть в списке
			const filtered = prev.filter((p) => p.id !== projectId);
			// Добавляем проект в начало списка
			const updated = [project, ...filtered].slice(0, MAX_RECENT_PROJECTS);
			// Сохраняем в localStorage
			localStorage.setItem("recentProjects", JSON.stringify(updated));
			return updated;
		});
	};

	// Загружаем проекты при инициализации
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setIsLoading(true);
				const data = await fetchAPI("/projects");
				// Преобразуем дату из строки в объект Date
				const projectsWithDateObjects = data.map(
					(project: Omit<Project, "createdAt"> & { createdAt: string }) => ({
						...project,
						createdAt: new Date(project.createdAt),
					})
				);
				setProjects(projectsWithDateObjects);
			} catch (error) {
				console.error("Ошибка при загрузке проектов:", error);
				toast({
					title: "Ошибка",
					description:
						error instanceof Error
							? error.message
							: "Не удалось загрузить проекты",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchProjects();
	}, [toast]);

	const addProject = async (
		name: string,
		description?: string
	): Promise<Project> => {
		if (!name) {
			throw new Error("Название проекта обязательно для заполнения");
		}

		try {
			setIsLoading(true);
			const newProject = await fetchAPI("/projects", {
				method: "POST",
				body: JSON.stringify({ name, description }),
			});

			// Преобразуем дату из строки в объект Date
			const projectWithDateObject = {
				...newProject,
				createdAt: new Date(newProject.createdAt),
			};

			setProjects((prev) => [...prev, projectWithDateObject]);

			toast({
				title: "Проект создан",
				description: "Новый проект успешно создан",
			});

			return projectWithDateObject;
		} catch (error) {
			console.error("Ошибка при создании проекта:", error);
			toast({
				title: "Ошибка",
				description:
					error instanceof Error ? error.message : "Не удалось создать проект",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const updateProject = async (
		id: string,
		data: Partial<Project>
	): Promise<Project> => {
		try {
			setIsLoading(true);
			const updatedProject = await fetchAPI(`/projects/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});

			// Преобразуем дату из строки в объект Date
			const projectWithDateObject = {
				...updatedProject,
				createdAt: new Date(updatedProject.createdAt),
			};

			setProjects((prev) =>
				prev.map((project) =>
					project.id === id ? projectWithDateObject : project
				)
			);

			toast({
				title: "Проект обновлен",
				description: "Проект успешно обновлен",
			});

			return projectWithDateObject;
		} catch (error) {
			console.error("Ошибка при обновлении проекта:", error);
			toast({
				title: "Ошибка",
				description:
					error instanceof Error ? error.message : "Не удалось обновить проект",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteProject = async (id: string): Promise<void> => {
		try {
			setIsLoading(true);
			await fetchAPI(`/projects/${id}`, {
				method: "DELETE",
			});

			setProjects((prev) => prev.filter((project) => project.id !== id));

			toast({
				title: "Проект удален",
				description: "Проект успешно удален",
			});
		} catch (error) {
			console.error("Ошибка при удалении проекта:", error);
			toast({
				title: "Ошибка",
				description:
					error instanceof Error ? error.message : "Не удалось удалить проект",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getProjectById = (id: string): Project | undefined => {
		return projects.find((project) => project.id === id);
	};

	return (
		<ProjectContext.Provider
			value={{
				projects,
				addProject,
				updateProject,
				deleteProject,
				getProjectById,
				recentProjects,
				addToRecentProjects,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
};

export default ProjectProvider;
