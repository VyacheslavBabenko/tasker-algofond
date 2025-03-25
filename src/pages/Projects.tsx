import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Plus,
	Folder,
	ArrowRight,
	MoreHorizontal,
	ListTodo,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/contexts/ProjectContext";
import { useTask } from "@/contexts/TaskContext";
import { useNavigate } from "react-router-dom";

const Projects = () => {
	const { toast } = useToast();
	const {
		projects,
		addProject,
		deleteProject,
		updateProject,
		getProjectById,
		addToRecentProjects,
		recentProjects,
	} = useProjects();
	const { setCurrentProjectId, getTasksCountByProject } = useTask();
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
	const [newProject, setNewProject] = useState({
		name: "",
		description: "",
	});
	const navigate = useNavigate();

	const filteredProjects = projects.filter(
		(project) =>
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(project.description &&
				project.description.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const handleAddProject = async () => {
		try {
			if (!newProject.name) {
				toast({
					title: "Ошибка",
					description: "Название проекта обязательно для заполнения",
					variant: "destructive",
				});
				return;
			}

			await addProject(newProject.name, newProject.description);
			setNewProject({ name: "", description: "" });
			setIsAddProjectOpen(false);
		} catch (error) {
			toast({
				title: "Ошибка",
				description:
					error instanceof Error ? error.message : "Не удалось создать проект",
				variant: "destructive",
			});
		}
	};

	const handleDeleteProject = async (id: string) => {
		try {
			if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
				await deleteProject(id);
			}
		} catch (error) {
			toast({
				title: "Ошибка",
				description:
					error instanceof Error ? error.message : "Не удалось удалить проект",
				variant: "destructive",
			});
		}
	};

	const handleOpenProject = (projectId: string) => {
		// Устанавливаем текущий проект перед навигацией
		setCurrentProjectId(projectId);

		// Добавляем проект в список недавно просмотренных
		addToRecentProjects(projectId);

		const projectName = getProjectById(projectId)?.name || "выбранного проекта";
		navigate(`/projects/${projectId}/tasks`);

		toast({
			title: `Проект "${projectName}"`,
			description: "Открыты задачи проекта",
		});
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("ru-RU", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(date);
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Проекты</h1>
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => {
							setCurrentProjectId("project-1");
							navigate("/tasks");
							toast({
								title: "Основная доска",
								description: "Открыты все задачи",
							});
						}}
					>
						<ListTodo className="mr-2 h-4 w-4" /> Все задачи
					</Button>
					<Button onClick={() => setIsAddProjectOpen(true)}>
						<Plus className="mr-2 h-4 w-4" /> Создать проект
					</Button>
				</div>
			</div>

			<div className="mb-6">
				<Input
					placeholder="Поиск по названию или описанию..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>

			{/* Недавно просмотренные проекты */}
			{recentProjects.length > 0 && !searchQuery && (
				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-4">Недавно просмотренные</h2>
					<div className="flex flex-wrap gap-3">
						{recentProjects.map((project) => (
							<Button
								key={project.id}
								variant="outline"
								className="flex items-center"
								onClick={() => handleOpenProject(project.id)}
							>
								<Folder className="h-4 w-4 mr-2 text-blue-500" />
								{project.name}
								<span className="text-xs text-gray-500 ml-2">
									({project.tasksCount || 0})
								</span>
							</Button>
						))}
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProjects.map((project) => (
					<Card key={project.id} className="overflow-hidden">
						<CardHeader className="pb-3">
							<div className="flex justify-between">
								<CardTitle className="flex items-center">
									<Folder className="h-5 w-5 mr-2 text-blue-500" />
									{project.name}
								</CardTitle>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() => handleDeleteProject(project.id)}
											className="text-red-500"
										>
											Удалить проект
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							{project.description && (
								<CardDescription className="mt-2">
									{project.description}
								</CardDescription>
							)}
						</CardHeader>
						<CardContent>
							<div className="text-sm text-gray-500">
								Создан: {formatDate(project.createdAt)}
							</div>
							<div className="mt-2 text-sm">
								Задач: <span className="font-medium">{project.tasksCount}</span>
							</div>
						</CardContent>
						<CardFooter className="border-t pt-4 pb-3">
							<Button
								variant="ghost"
								className="ml-auto"
								size="sm"
								onClick={() => handleOpenProject(project.id)}
							>
								Открыть задачи <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			{filteredProjects.length === 0 && (
				<div className="text-center py-12">
					<Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium mb-2">Проекты не найдены</h3>
					<p className="text-gray-500">
						{searchQuery
							? "Попробуйте изменить параметры поиска"
							: "Создайте свой первый проект"}
					</p>
				</div>
			)}

			{/* Диалог создания проекта */}
			<Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Создать новый проект</DialogTitle>
						<DialogDescription>
							Заполните информацию о новом проекте
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="project-name" className="text-right">
								Название*
							</Label>
							<Input
								id="project-name"
								value={newProject.name}
								onChange={(e) =>
									setNewProject({ ...newProject, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="project-description" className="text-right">
								Описание
							</Label>
							<Input
								id="project-description"
								value={newProject.description}
								onChange={(e) =>
									setNewProject({ ...newProject, description: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAddProjectOpen(false)}
						>
							Отмена
						</Button>
						<Button onClick={handleAddProject}>Создать</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Projects;
