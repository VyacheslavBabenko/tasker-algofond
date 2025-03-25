import React, { useState, forwardRef, useImperativeHandle } from "react";
import TaskItem from "./TaskItem";
import { useTask } from "@/contexts/TaskContext";
import { Task, SubTask as SubTaskType } from "@/contexts/TaskContext";
import { Filter, Plus, ChevronRight, Loader2, Settings } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Textarea } from "@/components/ui/textarea";

type FieldType = "text" | "number" | "list";

interface Field {
	id: string;
	name: string;
	type: FieldType;
	options?: Array<{ id: string; value: string; color: string }>;
}

const DEFAULT_FIELDS: Field[] = [
	// { id: "id", name: "ID", type: "text" },
	{ id: "date", name: "Дата", type: "text" },
	{ id: "result", name: "Результат", type: "text" },
	{ id: "object", name: "Объект", type: "text" },
	{ id: "task", name: "Задача", type: "text" },
	{
		id: "status",
		name: "Статус",
		type: "list",
		options: [
			{ id: "inProgress", value: "В работе", color: "#cffeb0" },
			{ id: "take", value: "Взять", color: "#ffd0d0" },
			{ id: "check", value: "Проверить", color: "#868686" },
			{ id: "blocked", value: "Блок софта", color: "#ff3838" },
		],
	},
	{ id: "assignee", name: "Исполнитель", type: "text" },
];

interface TaskListProps {
	boardId: string;
	viewMode?: "table" | "board" | "calendar";
}

export interface TaskListRef {
	openAddTaskModal: () => void;
	openAddFieldModal: () => void;
}

const TaskList = forwardRef<TaskListRef, TaskListProps>(
	({ boardId, viewMode = "table" }, ref) => {
		const {
			filteredTasks,
			updateTask,
			updateSubTask,
			addTask,
			deleteTask,
			addSubTask,
			reorderTasks,
			isLoading,
			teamMembers,
		} = useTask();
		const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
		const [showAddField, setShowAddField] = useState(false);
		const [newField, setNewField] = useState<{ name: string; type: FieldType }>(
			{
				name: "",
				type: "text",
			}
		);
		const [selectedField, setSelectedField] = useState<Field | null>(null);
		const [showFieldSettings, setShowFieldSettings] = useState(false);
		const [fieldFilters, setFieldFilters] = useState<Record<string, string>>(
			{}
		);
		const [showAddTask, setShowAddTask] = useState(false);
		const [newTask, setNewTask] = useState({
			id: "",
			date: "Март",
			result: "",
			object: "",
			task: "",
			status: "take" as "inProgress" | "take" | "check" | "blocked",
			statusLabel: "Взять",
			assignee: "Дима",
		});

		// Новое состояние для редактирования задачи
		const [editingTask, setEditingTask] = useState<Task | null>(null);
		const [showEditTask, setShowEditTask] = useState(false);

		// Новое состояние для редактирования подзадачи
		const [editingSubTask, setEditingSubTask] = useState<{
			taskId: string;
			subTask: SubTaskType;
		} | null>(null);
		const [showEditSubTask, setShowEditSubTask] = useState(false);

		const { toast } = useToast();
		const [showFieldType, setShowFieldType] = useState(false);

		// Функция для получения класса ширины поля
		const getFieldWidthClass = (fieldId: string) => {
			if (fieldId === "id") return "w-[60px]";
			if (fieldId === "date") return "w-[120px]";
			if (fieldId === "result") return "w-[180px]";
			if (fieldId === "object") return "w-[200px]";
			if (fieldId === "status") return "w-[150px]";
			if (fieldId === "assignee") return "w-[140px]";
			if (fieldId === "task") return "flex-1 min-w-[200px]";
			return "w-[150px]";
		};

		const fieldTypes = [
			{ id: "text", label: "Текст" },
			{ id: "number", label: "Номер" },
			{ id: "date", label: "Дата" },
			{ id: "selector", label: "Селектор" },
		];

		const handleSelectFieldType = (type: string) => {
			setNewField({ ...newField, type: type as FieldType });
			setShowFieldType(false);
		};

		const getFieldTypeLabel = () => {
			const fieldType = fieldTypes.find((type) => type.id === newField.type);
			return fieldType ? fieldType.label : "Текст";
		};

		useImperativeHandle(ref, () => ({
			openAddTaskModal: () => {
				setNewTask({
					id: `task_${Date.now()}`,
					date: "Март",
					result: "",
					object: "",
					task: "",
					status: "take" as "inProgress" | "take" | "check" | "blocked",
					statusLabel: "Взять",
					assignee: "Дима",
				});
				setShowAddTask(true);
			},
			openAddFieldModal: () => {
				setShowAddField(true);
			},
		}));

		const handleStatusChange = (
			id: string,
			status: "inProgress" | "take" | "check" | "blocked"
		) => {
			let statusLabel = "";
			switch (status) {
				case "inProgress":
					statusLabel = "В работе";
					break;
				case "take":
					statusLabel = "Взять";
					break;
				case "check":
					statusLabel = "Проверить";
					break;
				case "blocked":
					statusLabel = "Блок софта";
					break;
			}

			updateTask(id, { status, statusLabel });
		};

		const handleSubTaskStatusChange = (
			taskId: string,
			subTaskId: string,
			status: "inProgress" | "take" | "check" | "blocked"
		) => {
			let statusLabel = "";
			switch (status) {
				case "inProgress":
					statusLabel = "В работе";
					break;
				case "take":
					statusLabel = "Взять";
					break;
				case "check":
					statusLabel = "Проверить";
					break;
				case "blocked":
					statusLabel = "Блок софта";
					break;
			}

			updateSubTask(taskId, subTaskId, { status, statusLabel });
		};

		const handleAssigneeChange = (id: string, assignee: string) => {
			updateTask(id, { assignee });
		};

		const handleSubTaskAssigneeChange = (
			taskId: string,
			subTaskId: string,
			assignee: string
		) => {
			updateSubTask(taskId, subTaskId, { assignee });
		};

		const handleDeleteTask = (id: string) => {
			deleteTask(id);
			toast({
				title: "Задача удалена",
				description: "Задача успешно удалена",
			});
		};

		const handleAddSubTask = (
			taskId: string,
			subTask: Omit<SubTaskType, "id">
		) => {
			addSubTask(taskId, subTask);
		};

		const addField = () => {
			if (newField.name.trim()) {
				const newFieldObj: Field = {
					id: `field_${Date.now()}`,
					name: newField.name,
					type: newField.type as FieldType,
					...(newField.type === "list" ? { options: [] } : {}),
				};

				setFields([...fields, newFieldObj]);
				setNewField({ name: "", type: "text" });
				setShowAddField(false);

				toast({
					title: "Поле добавлено",
					description: `Поле "${newField.name}" успешно добавлено в таблицу`,
				});
			}
		};

		const openFieldSettings = (field: Field) => {
			setSelectedField(field);
			setShowFieldSettings(true);
		};

		const updateField = (updatedField: Field) => {
			setFields(
				fields.map((f) => (f.id === updatedField.id ? updatedField : f))
			);
			setSelectedField(null);
			setShowFieldSettings(false);
		};

		const deleteField = (id: string) => {
			setFields(fields.filter((f) => f.id !== id));
			setSelectedField(null);
			setShowFieldSettings(false);
		};

		const applyFilter = (fieldId: string, value: string) => {
			setFieldFilters({
				...fieldFilters,
				[fieldId]: value,
			});
		};

		const getFilteredTasks = () => {
			return filteredTasks.filter((task) => {
				for (const [fieldId, filterValue] of Object.entries(fieldFilters)) {
					if (!filterValue) continue;

					const fieldValue = task[fieldId]?.toString().toLowerCase();
					if (fieldValue && !fieldValue.includes(filterValue.toLowerCase())) {
						return false;
					}
				}
				return true;
			});
		};

		const openAddTaskModal = () => {
			setNewTask({
				id: `task_${Date.now()}`,
				date: "Март",
				result: "",
				object: "",
				task: "",
				status: "take" as "inProgress" | "take" | "check" | "blocked",
				statusLabel: "Взять",
				assignee: "Дима",
			});
			setShowAddTask(true);
		};

		const handleAddTask = () => {
			if (newTask.object.trim() === "" || newTask.task.trim() === "") {
				toast({
					title: "Ошибка",
					description: "Заполните обязательные поля: Объект и Задача",
					variant: "destructive",
				});
				return;
			}

			addTask(newTask);
			setShowAddTask(false);
			toast({
				title: "Успешно",
				description: "Задача добавлена",
			});
		};

		// Настройка сенсоров для перетаскивания
		const sensors = useSensors(
			useSensor(PointerSensor, {
				// Увеличиваем активационное расстояние для предотвращения случайных перетаскиваний
				activationConstraint: {
					distance: 5,
				},
			}),
			useSensor(KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			})
		);

		// Обработчик окончания перетаскивания
		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;

			if (over && active.id !== over.id) {
				const oldIndex = filteredTasks.findIndex(
					(task) => task.id === active.id
				);
				const newIndex = filteredTasks.findIndex((task) => task.id === over.id);

				if (oldIndex !== -1 && newIndex !== -1) {
					const taskId = filteredTasks[oldIndex].id;
					reorderTasks(taskId, oldIndex, newIndex);

					toast({
						title: "Задача перемещена",
						description: "Порядок задач успешно изменен",
					});
				}
			}
		};

		// Добавляем компонент индикатора загрузки
		const LoadingIndicator = () => (
			<div className="flex items-center justify-center w-full py-12">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
				<span className="ml-2 text-gray-500">Загрузка данных...</span>
			</div>
		);

		// Обработчик для начала редактирования задачи
		const handleEditTask = (task: Task) => {
			setEditingTask({ ...task });
			setShowEditTask(true);
		};

		// Обработчик сохранения отредактированной задачи
		const handleSaveEditedTask = async () => {
			if (!editingTask) return;

			if (editingTask.object.trim() === "" || editingTask.task.trim() === "") {
				toast({
					title: "Ошибка",
					description: "Заполните обязательные поля: Объект и Задача",
					variant: "destructive",
				});
				return;
			}

			try {
				// Сохраняем предыдущий статус и активный фильтр перед обновлением
				const prevStatus = editingTask.status;

				// Обновляем задачу
				await updateTask(editingTask.id, editingTask);

				// Если статус изменился и используется фильтр по статусу, обновляем его
				// чтобы задача осталась видимой
				if (
					prevStatus !== editingTask.status &&
					fieldFilters.status === prevStatus
				) {
					// Если мы фильтруем по предыдущему статусу, то обновляем на новый
					setFieldFilters({
						...fieldFilters,
						status: editingTask.status,
					});

					toast({
						title: "Фильтр обновлен",
						description:
							"Фильтр по статусу изменен для отображения отредактированной задачи",
					});
				}

				setShowEditTask(false);
				toast({
					title: "Успешно",
					description: "Задача обновлена",
				});
			} catch (error) {
				console.error("Ошибка при обновлении задачи:", error);
				toast({
					title: "Ошибка",
					description: "Не удалось обновить задачу",
					variant: "destructive",
				});
			}
		};

		// Обработчик для начала редактирования подзадачи
		const handleEditSubTask = (taskId: string, subTask: SubTaskType) => {
			setEditingSubTask({ taskId, subTask: { ...subTask } });
			setShowEditSubTask(true);
		};

		// Обработчик сохранения отредактированной подзадачи
		const handleSaveEditedSubTask = async () => {
			if (!editingSubTask) return;

			if (
				editingSubTask.subTask.object.trim() === "" ||
				editingSubTask.subTask.description.trim() === ""
			) {
				toast({
					title: "Ошибка",
					description: "Заполните обязательные поля: Объект и Описание",
					variant: "destructive",
				});
				return;
			}

			try {
				// Сохраняем предыдущий статус
				const prevStatus = editingSubTask.subTask.status;

				// Обновляем подзадачу
				await updateSubTask(
					editingSubTask.taskId,
					editingSubTask.subTask.id,
					editingSubTask.subTask
				);

				// Если статус изменился и используется фильтр по статусу, обновляем его
				if (
					prevStatus !== editingSubTask.subTask.status &&
					fieldFilters.status === prevStatus
				) {
					setFieldFilters({
						...fieldFilters,
						status: editingSubTask.subTask.status,
					});

					toast({
						title: "Фильтр обновлен",
						description:
							"Фильтр по статусу изменен для отображения отредактированной подзадачи",
					});
				}

				setShowEditSubTask(false);
				toast({
					title: "Успешно",
					description: "Подзадача обновлена",
				});
			} catch (error) {
				console.error("Ошибка при обновлении подзадачи:", error);
				toast({
					title: "Ошибка",
					description: "Не удалось обновить подзадачу",
					variant: "destructive",
				});
			}
		};

		// Функция для отображения задач в режиме таблицы (существующая реализация)
		const renderTableView = () => {
			return (
				<div className="mt-6 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
					{/* Заголовок таблицы */}
					<div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
						<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
							<h3 className="font-medium">
								Задачи ({getFilteredTasks().length})
							</h3>
							<div className="flex items-center gap-3">
								{Object.keys(fieldFilters).length > 0 && (
									<button
										className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100"
										onClick={() => {
											setFieldFilters({});
											toast({
												title: "Фильтры сброшены",
												description: "Все фильтры были сброшены",
											});
										}}
									>
										Сбросить фильтры
									</button>
								)}
							</div>
						</div>
						<div className="flex items-center h-12">
							{/* Колонка для кнопок expand/collapse */}
							<div className="w-[50px] flex justify-center">
								<div className="flex items-center justify-center h-full">
									<div className="w-5"></div>
								</div>
							</div>

							{/* Колонка для drag handle */}
							<div className="w-[30px]"></div>

							{/* Заголовки полей */}
							{fields.map((field) => (
								<div
									key={field.id}
									className={`${getFieldWidthClass(field.id)} px-4 py-3`}
								>
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm text-gray-700">
											{field.name}
										</span>
										{field.id === "status" ? (
											<DropdownMenu>
												<DropdownMenuTrigger>
													<button className="p-1 rounded-full hover:bg-gray-200">
														<Filter className="h-3.5 w-3.5 text-gray-500" />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="start">
													{DEFAULT_FIELDS.find(
														(f) => f.id === "status"
													)?.options?.map((option) => (
														<DropdownMenuItem
															key={option.id}
															onClick={() => {
																const newFilters = { ...fieldFilters };
																if (newFilters.status === option.id) {
																	delete newFilters.status;
																} else {
																	newFilters.status = option.id;
																}
																setFieldFilters(newFilters);
															}}
															className="flex items-center gap-2 cursor-pointer"
														>
															<div
																className="w-2 h-2 rounded-full"
																style={{ backgroundColor: option.color }}
															></div>
															<span
																className={
																	fieldFilters.status === option.id
																		? "font-medium"
																		: ""
																}
															>
																{option.value}
															</span>
															{fieldFilters.status === option.id && (
																<span className="ml-auto text-green-600 text-xs">
																	✓
																</span>
															)}
														</DropdownMenuItem>
													))}
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => {
															const newFilters = { ...fieldFilters };
															delete newFilters.status;
															setFieldFilters(newFilters);
														}}
														className="text-xs text-center cursor-pointer"
													>
														Сбросить фильтр
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										) : (
											<button
												className="p-1 rounded-full hover:bg-gray-200"
												onClick={() => openFieldSettings(field)}
											>
												<Settings className="h-3.5 w-3.5 text-gray-500" />
											</button>
										)}
									</div>
								</div>
							))}

							{/* Колонка для действий */}
							<div className="w-[50px]"></div>
						</div>
					</div>

					{/* Тело таблицы */}
					{isLoading ? (
						<LoadingIndicator />
					) : getFilteredTasks().length === 0 ? (
						<div className="py-16 text-center text-gray-500">
							<div className="flex flex-col items-center justify-center gap-3">
								<Filter className="h-8 w-8 text-gray-400" />
								<p>Задачи не найдены</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-2"
									onClick={() => {
										setFieldFilters({});
										toast({
											title: "Фильтры сброшены",
											description: "Все фильтры были сброшены",
										});
									}}
								>
									Сбросить фильтры
								</Button>
							</div>
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={getFilteredTasks().map((task) => task.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="divide-y divide-gray-100">
									{getFilteredTasks().map((task, index) => (
										<TaskItem
											key={task.id}
											{...task}
											fields={fields}
											onStatusChange={handleStatusChange}
											onSubTaskStatusChange={handleSubTaskStatusChange}
											onAssigneeChange={handleAssigneeChange}
											onSubTaskAssigneeChange={handleSubTaskAssigneeChange}
											onDeleteTask={handleDeleteTask}
											onAddSubTask={handleAddSubTask}
											onEditTask={() => handleEditTask(task)}
											onEditSubTask={(subTaskId) => {
												const subTask = task.subTasks?.find(
													(st) => st.id === subTaskId
												);
												if (subTask) {
													handleEditSubTask(task.id, subTask);
												}
											}}
											className={index % 2 === 0 ? "" : "bg-gray-50"}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
					)}
				</div>
			);
		};

		// Функция для отображения задач в режиме канбан
		const renderBoardView = () => {
			// Группируем задачи по статусам
			const tasksByStatus = {
				take: filteredTasks.filter((task) => task.status === "take"),
				inProgress: filteredTasks.filter(
					(task) => task.status === "inProgress"
				),
				check: filteredTasks.filter((task) => task.status === "check"),
				blocked: filteredTasks.filter((task) => task.status === "blocked"),
			};

			return (
				<div className="mt-6 flex gap-4 overflow-x-auto pb-4">
					{/* Колонка "Взять" */}
					<div className="flex-shrink-0 w-80">
						<div className="bg-gray-100 rounded-t-lg px-4 py-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-[#ffd0d0]"></div>
								<h3 className="font-medium">Взять</h3>
							</div>
							<span className="bg-white text-sm px-2 py-1 rounded-full">
								{tasksByStatus.take.length}
							</span>
						</div>
						<div className="bg-gray-50 rounded-b-lg p-3 min-h-[calc(100vh-280px)]">
							{tasksByStatus.take.map((task) => (
								<div
									key={task.id}
									className="bg-white p-3 rounded-lg mb-3 shadow-sm"
								>
									<div className="text-sm font-medium mb-2">{task.task}</div>
									<div className="text-xs text-gray-500 mb-2">
										{task.object}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-xs bg-gray-100 px-2 py-1 rounded">
											{task.assignee}
										</span>
										<button className="text-xs text-blue-500">Подробнее</button>
									</div>
								</div>
							))}
							{tasksByStatus.take.length === 0 && (
								<div className="text-center text-gray-400 text-sm mt-4">
									Нет задач
								</div>
							)}
						</div>
					</div>

					{/* Колонка "В работе" */}
					<div className="flex-shrink-0 w-80">
						<div className="bg-gray-100 rounded-t-lg px-4 py-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-[#cffeb0]"></div>
								<h3 className="font-medium">В работе</h3>
							</div>
							<span className="bg-white text-sm px-2 py-1 rounded-full">
								{tasksByStatus.inProgress.length}
							</span>
						</div>
						<div className="bg-gray-50 rounded-b-lg p-3 min-h-[calc(100vh-280px)]">
							{tasksByStatus.inProgress.map((task) => (
								<div
									key={task.id}
									className="bg-white p-3 rounded-lg mb-3 shadow-sm"
								>
									<div className="text-sm font-medium mb-2">{task.task}</div>
									<div className="text-xs text-gray-500 mb-2">
										{task.object}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-xs bg-gray-100 px-2 py-1 rounded">
											{task.assignee}
										</span>
										<button className="text-xs text-blue-500">Подробнее</button>
									</div>
								</div>
							))}
							{tasksByStatus.inProgress.length === 0 && (
								<div className="text-center text-gray-400 text-sm mt-4">
									Нет задач
								</div>
							)}
						</div>
					</div>

					{/* Колонка "Проверить" */}
					<div className="flex-shrink-0 w-80">
						<div className="bg-gray-100 rounded-t-lg px-4 py-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-[#868686]"></div>
								<h3 className="font-medium">Проверить</h3>
							</div>
							<span className="bg-white text-sm px-2 py-1 rounded-full">
								{tasksByStatus.check.length}
							</span>
						</div>
						<div className="bg-gray-50 rounded-b-lg p-3 min-h-[calc(100vh-280px)]">
							{tasksByStatus.check.map((task) => (
								<div
									key={task.id}
									className="bg-white p-3 rounded-lg mb-3 shadow-sm"
								>
									<div className="text-sm font-medium mb-2">{task.task}</div>
									<div className="text-xs text-gray-500 mb-2">
										{task.object}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-xs bg-gray-100 px-2 py-1 rounded">
											{task.assignee}
										</span>
										<button className="text-xs text-blue-500">Подробнее</button>
									</div>
								</div>
							))}
							{tasksByStatus.check.length === 0 && (
								<div className="text-center text-gray-400 text-sm mt-4">
									Нет задач
								</div>
							)}
						</div>
					</div>

					{/* Колонка "Блок софта" */}
					<div className="flex-shrink-0 w-80">
						<div className="bg-gray-100 rounded-t-lg px-4 py-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-[#ff3838]"></div>
								<h3 className="font-medium">Блок софта</h3>
							</div>
							<span className="bg-white text-sm px-2 py-1 rounded-full">
								{tasksByStatus.blocked.length}
							</span>
						</div>
						<div className="bg-gray-50 rounded-b-lg p-3 min-h-[calc(100vh-280px)]">
							{tasksByStatus.blocked.map((task) => (
								<div
									key={task.id}
									className="bg-white p-3 rounded-lg mb-3 shadow-sm"
								>
									<div className="text-sm font-medium mb-2">{task.task}</div>
									<div className="text-xs text-gray-500 mb-2">
										{task.object}
									</div>
									<div className="flex justify-between items-center">
										<span className="text-xs bg-gray-100 px-2 py-1 rounded">
											{task.assignee}
										</span>
										<button className="text-xs text-blue-500">Подробнее</button>
									</div>
								</div>
							))}
							{tasksByStatus.blocked.length === 0 && (
								<div className="text-center text-gray-400 text-sm mt-4">
									Нет задач
								</div>
							)}
						</div>
					</div>
				</div>
			);
		};

		// Функция для отображения задач в режиме календаря
		const renderCalendarView = () => {
			// Получим список дней месяца
			const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
			const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

			return (
				<div className="mt-6 bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
					<div className="text-lg font-medium mb-4">Март 2024</div>
					<div className="grid grid-cols-7 gap-1 min-w-[1000px]">
						{/* Дни недели */}
						{weekdays.map((day, index) => (
							<div
								key={day}
								className="text-center font-medium text-sm py-2 border-b"
							>
								{day}
							</div>
						))}

						{/* Пустые ячейки в начале месяца (если месяц начинается не с понедельника) */}
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={`empty-${index}`}
								className="h-32 border border-gray-100 bg-gray-50"
							></div>
						))}

						{/* Дни месяца */}
						{daysInMonth.map((day) => (
							<div
								key={day}
								className="h-32 border border-gray-100 p-1 relative"
							>
								<div className="absolute top-1 right-1 text-xs text-gray-400">
									{day}
								</div>
								<div className="mt-4">
									{/* Отображаем задачи, если их дата совпадает с текущим днем (упрощенно) */}
									{filteredTasks
										.filter((task) => day % 5 === 0) // Это для демонстрации, в реальности нужно проверять реальную дату
										.slice(0, 2)
										.map((task) => (
											<div
												key={task.id}
												className="mb-1 px-1 py-0.5 text-xs bg-blue-50 rounded truncate"
											>
												{task.task}
											</div>
										))}
									{day % 5 === 0 && filteredTasks.length > 2 && (
										<div className="text-xs text-center text-gray-500">
											+ ещё
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			);
		};

		return (
			<div>
				{/* Выбор отображения в зависимости от режима */}
				{viewMode === "table" && renderTableView()}
				{viewMode === "board" && renderBoardView()}
				{viewMode === "calendar" && renderCalendarView()}

				{/* Существующие диалоги */}
				<Dialog open={showAddField} onOpenChange={setShowAddField}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Добавить поле</DialogTitle>
							<DialogDescription>
								Создайте новое поле для вашей доски
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="fieldName" className="text-right">
									Имя
								</label>
								<Input
									id="fieldName"
									value={newField.name}
									onChange={(e) =>
										setNewField({ ...newField, name: e.target.value })
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="fieldType" className="text-right">
									Тип
								</label>
								<div
									className="col-span-3 p-2 border rounded flex justify-between items-center cursor-pointer"
									onClick={() => setShowFieldType(true)}
								>
									{getFieldTypeLabel()}
									<ChevronRight className="h-4 w-4" />
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowAddField(false)}
							>
								Отмена
							</Button>
							<Button type="submit" onClick={addField}>
								Добавить
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog open={showFieldType} onOpenChange={setShowFieldType}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Тип поля</DialogTitle>
						</DialogHeader>
						<div className="grid gap-2 py-4">
							{fieldTypes.map((type) => (
								<div
									key={type.id}
									className={`py-3 px-4 rounded-md cursor-pointer ${
										newField.type === type.id
											? "bg-[#2d2d2d] text-white"
											: "bg-gray-100"
									}`}
									onClick={() => handleSelectFieldType(type.id)}
								>
									{type.label}
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>

				<Dialog open={showFieldSettings} onOpenChange={setShowFieldSettings}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Настройка поля</DialogTitle>
						</DialogHeader>
						{selectedField && (
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="settingsName" className="text-right">
										Имя
									</label>
									<Input
										id="settingsName"
										value={selectedField.name}
										onChange={(e) =>
											setSelectedField({
												...selectedField,
												name: e.target.value,
											})
										}
										className="col-span-3"
									/>
								</div>

								{selectedField.type === "list" && (
									<div className="mt-4">
										<h3 className="mb-2 font-medium">Опции списка</h3>
										{selectedField.options?.map((option, index) => (
											<div
												key={option.id}
												className="flex items-center gap-2 mb-2"
											>
												<div
													className="w-4 h-4 rounded-full"
													style={{ backgroundColor: option.color }}
												></div>
												<Input
													value={option.value}
													onChange={(e) => {
														const newOptions = [
															...(selectedField.options || []),
														];
														newOptions[index] = {
															...option,
															value: e.target.value,
														};
														setSelectedField({
															...selectedField,
															options: newOptions,
														});
													}}
												/>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														const newOptions = (
															selectedField.options || []
														).filter((o) => o.id !== option.id);
														setSelectedField({
															...selectedField,
															options: newOptions,
														});
													}}
												>
													Удалить
												</Button>
											</div>
										))}
										<Button
											className="mt-2"
											onClick={() => {
												const newOption = {
													id: `option_${Date.now()}`,
													value: "Новый пункт",
													color:
														"#" +
														Math.floor(Math.random() * 16777215).toString(16),
												};
												setSelectedField({
													...selectedField,
													options: [
														...(selectedField.options || []),
														newOption,
													],
												});
											}}
										>
											Добавить пункт
										</Button>
									</div>
								)}
							</div>
						)}
						<DialogFooter>
							<Button
								type="button"
								variant="destructive"
								onClick={() => selectedField && deleteField(selectedField.id)}
							>
								Удалить
							</Button>
							<Button
								type="submit"
								onClick={() => selectedField && updateField(selectedField)}
							>
								Сохранить
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog open={showAddTask} onOpenChange={setShowAddTask}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Добавить задачу</DialogTitle>
							<DialogDescription>
								Создайте новую задачу для вашей доски
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="taskObject" className="text-right">
									Объект *
								</label>
								<Input
									id="taskObject"
									value={newTask.object}
									onChange={(e) =>
										setNewTask({ ...newTask, object: e.target.value })
									}
									className="col-span-3"
									placeholder="Введите объект"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="taskDescription" className="text-right">
									Задача *
								</label>
								<Input
									id="taskDescription"
									value={newTask.task}
									onChange={(e) =>
										setNewTask({ ...newTask, task: e.target.value })
									}
									className="col-span-3"
									placeholder="Введите описание задачи"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="taskResult" className="text-right">
									Результат
								</label>
								<Input
									id="taskResult"
									value={newTask.result}
									onChange={(e) =>
										setNewTask({ ...newTask, result: e.target.value })
									}
									className="col-span-3"
									placeholder="Введите ожидаемый результат"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="taskAssignee" className="text-right">
									Исполнитель
								</label>
								<select
									id="taskAssignee"
									value={newTask.assignee}
									onChange={(e) =>
										setNewTask({ ...newTask, assignee: e.target.value })
									}
									className="col-span-3 p-2 border rounded"
								>
									<option value="Дима">Дима</option>
									<option value="Денис">Денис</option>
									<option value="Женя">Женя</option>
									<option value="Саша">Саша</option>
									<option value="Дэ Хан">Дэ Хан</option>
									<option value="Леша">Леша</option>
									<option value="Николай">Николай</option>
									<option value="Насим">Насим</option>
									<option value="Коля">Коля</option>
									<option value="Илья">Илья</option>
								</select>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="taskStatus" className="text-right">
									Статус
								</label>
								<select
									id="taskStatus"
									value={newTask.status}
									onChange={(e) => {
										const status = e.target.value as
											| "inProgress"
											| "take"
											| "check"
											| "blocked";
										let statusLabel = "";
										switch (status) {
											case "inProgress":
												statusLabel = "В работе";
												break;
											case "take":
												statusLabel = "Взять";
												break;
											case "check":
												statusLabel = "Проверить";
												break;
											case "blocked":
												statusLabel = "Блок софта";
												break;
										}
										setNewTask({ ...newTask, status, statusLabel });
									}}
									className="col-span-3 p-2 border rounded"
								>
									<option value="inProgress">В работе</option>
									<option value="take">Взять</option>
									<option value="check">Проверить</option>
									<option value="blocked">Блок софта</option>
								</select>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowAddTask(false)}
							>
								Отмена
							</Button>
							<Button type="submit" onClick={handleAddTask}>
								Добавить
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Диалог редактирования задачи */}
				<Dialog open={showEditTask} onOpenChange={setShowEditTask}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Редактировать задачу</DialogTitle>
							<DialogDescription>Измените данные задачи</DialogDescription>
						</DialogHeader>
						{editingTask && (
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editTaskObject" className="text-right">
										Объект *
									</label>
									<Input
										id="editTaskObject"
										value={editingTask.object}
										onChange={(e) =>
											setEditingTask({
												...editingTask,
												object: e.target.value,
											})
										}
										className="col-span-3"
										placeholder="Введите объект"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editTaskDescription" className="text-right">
										Задача *
									</label>
									<Textarea
										id="editTaskDescription"
										value={editingTask.task}
										onChange={(e) =>
											setEditingTask({
												...editingTask,
												task: e.target.value,
											})
										}
										className="col-span-3"
										placeholder="Введите описание задачи"
										rows={3}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editTaskResult" className="text-right">
										Результат
									</label>
									<Input
										id="editTaskResult"
										value={editingTask.result}
										onChange={(e) =>
											setEditingTask({
												...editingTask,
												result: e.target.value,
											})
										}
										className="col-span-3"
										placeholder="Введите ожидаемый результат"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editTaskAssignee" className="text-right">
										Исполнитель
									</label>
									<select
										id="editTaskAssignee"
										value={editingTask.assignee}
										onChange={(e) =>
											setEditingTask({
												...editingTask,
												assignee: e.target.value,
											})
										}
										className="col-span-3 p-2 border rounded"
									>
										{teamMembers.map((member) => (
											<option key={member.id} value={member.name}>
												{member.name}
											</option>
										))}
									</select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editTaskStatus" className="text-right">
										Статус
									</label>
									<select
										id="editTaskStatus"
										value={editingTask.status}
										onChange={(e) => {
											const status = e.target.value as
												| "inProgress"
												| "take"
												| "check"
												| "blocked";
											let statusLabel = "";
											switch (status) {
												case "inProgress":
													statusLabel = "В работе";
													break;
												case "take":
													statusLabel = "Взять";
													break;
												case "check":
													statusLabel = "Проверить";
													break;
												case "blocked":
													statusLabel = "Блок софта";
													break;
											}
											setEditingTask({
												...editingTask,
												status,
												statusLabel,
											});
										}}
										className="col-span-3 p-2 border rounded"
									>
										<option value="inProgress">В работе</option>
										<option value="take">Взять</option>
										<option value="check">Проверить</option>
										<option value="blocked">Блок софта</option>
									</select>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowEditTask(false)}
							>
								Отмена
							</Button>
							<Button type="submit" onClick={handleSaveEditedTask}>
								Сохранить
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Диалог редактирования подзадачи */}
				<Dialog open={showEditSubTask} onOpenChange={setShowEditSubTask}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Редактировать подзадачу</DialogTitle>
							<DialogDescription>Измените данные подзадачи</DialogDescription>
						</DialogHeader>
						{editingSubTask && (
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editSubTaskObject" className="text-right">
										Объект *
									</label>
									<Input
										id="editSubTaskObject"
										value={editingSubTask.subTask.object}
										onChange={(e) =>
											setEditingSubTask({
												...editingSubTask,
												subTask: {
													...editingSubTask.subTask,
													object: e.target.value,
												},
											})
										}
										className="col-span-3"
										placeholder="Введите объект"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label
										htmlFor="editSubTaskDescription"
										className="text-right"
									>
										Описание *
									</label>
									<Textarea
										id="editSubTaskDescription"
										value={editingSubTask.subTask.description}
										onChange={(e) =>
											setEditingSubTask({
												...editingSubTask,
												subTask: {
													...editingSubTask.subTask,
													description: e.target.value,
												},
											})
										}
										className="col-span-3"
										placeholder="Введите описание подзадачи"
										rows={3}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editSubTaskAssignee" className="text-right">
										Исполнитель
									</label>
									<select
										id="editSubTaskAssignee"
										value={editingSubTask.subTask.assignee}
										onChange={(e) =>
											setEditingSubTask({
												...editingSubTask,
												subTask: {
													...editingSubTask.subTask,
													assignee: e.target.value,
												},
											})
										}
										className="col-span-3 p-2 border rounded"
									>
										{teamMembers.map((member) => (
											<option key={member.id} value={member.name}>
												{member.name}
											</option>
										))}
									</select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<label htmlFor="editSubTaskStatus" className="text-right">
										Статус
									</label>
									<select
										id="editSubTaskStatus"
										value={editingSubTask.subTask.status}
										onChange={(e) => {
											const status = e.target.value as
												| "inProgress"
												| "take"
												| "check"
												| "blocked";
											let statusLabel = "";
											switch (status) {
												case "inProgress":
													statusLabel = "В работе";
													break;
												case "take":
													statusLabel = "Взять";
													break;
												case "check":
													statusLabel = "Проверить";
													break;
												case "blocked":
													statusLabel = "Блок софта";
													break;
											}
											setEditingSubTask({
												...editingSubTask,
												subTask: {
													...editingSubTask.subTask,
													status,
													statusLabel,
												},
											});
										}}
										className="col-span-3 p-2 border rounded"
									>
										<option value="inProgress">В работе</option>
										<option value="take">Взять</option>
										<option value="check">Проверить</option>
										<option value="blocked">Блок софта</option>
									</select>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowEditSubTask(false)}
							>
								Отмена
							</Button>
							<Button type="submit" onClick={handleSaveEditedSubTask}>
								Сохранить
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);

TaskList.displayName = "TaskList";

export default TaskList;
