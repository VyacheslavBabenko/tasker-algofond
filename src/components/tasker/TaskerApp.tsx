import React, { useState, useRef, useEffect } from "react";
import {
	Package,
	Users,
	FileText,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { TaskProvider, useTask } from "@/contexts/TaskContext";
import { ProjectProvider, useProjects } from "@/contexts/ProjectContext";
import {
	Routes,
	Route,
	Navigate,
	Outlet,
	useLocation,
	Link,
	useParams,
	useNavigate,
} from "react-router-dom";
import Projects from "@/pages/Projects";
import Team from "@/pages/Team";
import TaskList from "./TaskList";
import Header from "./Header";
import FilterBar from "./FilterBar";
import { TaskListRef } from "./TaskList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Компонент обертка для TaskList с необходимыми пропсами
const TasksPage = () => {
	const taskListRef = useRef<TaskListRef>(null);
	const { currentProjectId } = useTask();
	const { getProjectById } = useProjects();
	const navigate = useNavigate();

	const handleAddTaskClick = () => {
		if (taskListRef.current) {
			taskListRef.current.openAddTaskModal();
		}
	};

	const handleAddFieldClick = () => {
		if (taskListRef.current && taskListRef.current.openAddFieldModal) {
			taskListRef.current.openAddFieldModal();
		}
	};

	// Получаем текущий проект
	const currentProject = currentProjectId
		? getProjectById(currentProjectId)
		: { name: "Основная доска" };

	return (
		<div className="flex flex-col flex-1">
			<div className="flex-1 px-10">
				<div className="flex justify-between items-center mt-10">
					<h1 className="text-2xl font-bold">
						{currentProject ? currentProject.name : "Основная доска"}
						{currentProject && currentProjectId !== "project-1" && (
							<Button
								variant="ghost"
								size="sm"
								className="ml-2 text-sm font-normal"
								onClick={() => navigate("/projects")}
							>
								(Вернуться к проектам)
							</Button>
						)}
					</h1>
				</div>
				<TaskList
					boardId={currentProjectId || "main"}
					viewMode="table"
					ref={taskListRef}
				/>
			</div>
			<div className="mt-auto sticky bottom-0 left-0 right-0 z-10">
				<FilterBar
					onAddTask={handleAddTaskClick}
					onAddField={handleAddFieldClick}
				/>
			</div>
		</div>
	);
};

// Компонент для верстки шаблона с сайдбаром и основным контентом
const Layout = () => {
	const location = useLocation();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const { tasks, currentProjectId } = useTask();
	const { getProjectById } = useProjects();

	// Загружаем данные текущего проекта для заголовка и статистики
	const [currentProject, setCurrentProject] = useState<{
		tasksCount?: number;
		name?: string;
	} | null>(null);

	useEffect(() => {
		if (currentProjectId) {
			const project = getProjectById(currentProjectId);
			setCurrentProject(project);
		}
	}, [currentProjectId, getProjectById]);

	// Отфильтруем задачи только по текущему проекту для статистики
	const projectTasks = tasks.filter((task) =>
		!currentProjectId || currentProjectId === "project-1"
			? true
			: task.projectId === currentProjectId
	);

	// Подсчет задач по статусам для отображения статистики
	const counts = {
		total: projectTasks.length,
		completed: projectTasks.filter((task) => task.status === "check").length,
		inProgress: projectTasks.filter((task) => task.status === "inProgress")
			.length,
		todo: projectTasks.filter((task) => task.status === "take").length,
		blocked: projectTasks.filter((task) => task.status === "blocked").length,
	};

	// Если у нас есть данные о проекте, и они содержат счетчик задач, используем его
	if (currentProject && typeof currentProject.tasksCount !== "undefined") {
		counts.total = currentProject.tasksCount;
	}

	const toggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	return (
		<div className="flex flex-col h-screen">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				{/* Сайдбар */}
				<div
					className={`relative transition-all duration-300 ${
						sidebarCollapsed ? "w-16" : "w-64"
					}`}
				>
					<div className="flex flex-col h-full border-r border-gray-200 bg-white">
						<div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
							<div className="flex items-center justify-between px-4 mb-6">
								{!sidebarCollapsed && (
									<div className="text-xl font-medium text-[#2d2d2d] flex items-center">
										<div className="mr-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-8 w-8 rounded-md flex items-center justify-center">
											T
										</div>
										Таскер
									</div>
								)}
								{sidebarCollapsed && (
									<div className="mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-8 w-8 rounded-md flex items-center justify-center">
										T
									</div>
								)}
								<Button
									variant="ghost"
									size="icon"
									onClick={toggleSidebar}
									className="ml-auto"
								>
									{sidebarCollapsed ? (
										<ChevronRight className="h-5 w-5" />
									) : (
										<ChevronLeft className="h-5 w-5" />
									)}
								</Button>
							</div>
							<div className="flex-grow flex flex-col">
								<nav className="flex-1 px-2 space-y-1">
									<Link
										to="/projects"
										className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
											location.pathname.includes("/projects")
												? "bg-gray-100 text-gray-900"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
									>
										<Package className="h-5 w-5 text-gray-500 mr-3" />
										{!sidebarCollapsed && <span>Проекты</span>}
									</Link>
									<Link
										to="/tasks"
										className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
											location.pathname === "/tasks" ||
											(location.pathname.includes("/projects") &&
												location.pathname.includes("/tasks"))
												? "bg-gray-100 text-gray-900"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
									>
										<FileText className="h-5 w-5 text-gray-500 mr-3" />
										{!sidebarCollapsed && <span>Задачи</span>}
									</Link>
									<Link
										to="/team"
										className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
											location.pathname === "/team"
												? "bg-gray-100 text-gray-900"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
									>
										<Users className="h-5 w-5 text-gray-500 mr-3" />
										{!sidebarCollapsed && <span>Команда</span>}
									</Link>
								</nav>
							</div>

							{/* Блок статистики */}
							{!sidebarCollapsed && (
								<div className="px-4 pt-4 pb-2 border-t border-gray-200">
									<h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
										Статистика задач
									</h2>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Всего:</span>
											<Badge variant="secondary">{counts.total}</Badge>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Завершено:</span>
											<Badge
												variant="outline"
												className="bg-green-50 text-green-700 border-green-200"
											>
												{counts.completed}
											</Badge>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">В процессе:</span>
											<Badge
												variant="outline"
												className="bg-blue-50 text-blue-700 border-blue-200"
											>
												{counts.inProgress}
											</Badge>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												К выполнению:
											</span>
											<Badge
												variant="outline"
												className="bg-orange-50 text-orange-700 border-orange-200"
											>
												{counts.todo}
											</Badge>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												Заблокировано:
											</span>
											<Badge
												variant="outline"
												className="bg-red-50 text-red-700 border-red-200"
											>
												{counts.blocked}
											</Badge>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Основной контент */}
				<div className="flex flex-col flex-1 bg-[#f9f9f9] overflow-auto">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

const TaskerApp = () => {
	return (
		<ProjectProvider>
			<TaskProvider>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Navigate to="/tasks" replace />} />
						<Route path="projects" element={<Projects />} />
						<Route path="tasks" element={<TasksPage />} />
						<Route
							path="projects/:projectId/tasks"
							element={<ProjectTasksPage />}
						/>
						<Route path="team" element={<Team />} />
					</Route>
				</Routes>
			</TaskProvider>
		</ProjectProvider>
	);
};

// Компонент для задач конкретного проекта
const ProjectTasksPage = () => {
	const { projectId } = useParams();
	const { setCurrentProjectId } = useTask();
	const { getProjectById, addToRecentProjects } = useProjects();
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		if (projectId) {
			setCurrentProjectId(projectId);
			// Добавляем проект в список недавно просмотренных
			addToRecentProjects(projectId);
			// Показываем уведомление при загрузке проекта
			const projectName = getProjectById(projectId)?.name || "проекта";
			toast({
				title: `Проект "${projectName}"`,
				description: "Загружены задачи проекта",
			});
		}
	}, [
		projectId,
		setCurrentProjectId,
		getProjectById,
		toast,
		addToRecentProjects,
	]);

	return <TasksPage />;
};

export default TaskerApp;
