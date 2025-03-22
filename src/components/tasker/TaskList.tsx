import React, { useState, forwardRef, useImperativeHandle } from "react";
import TaskItem from "./TaskItem";
import { useTask } from "@/contexts/TaskContext";
import { Task, SubTask as SubTaskType } from "@/contexts/TaskContext";
import { Filter, Plus, ChevronRight, Loader2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
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
}

export interface TaskListRef {
	openAddTaskModal: () => void;
	openAddFieldModal: () => void;
}

const TaskList = forwardRef<TaskListRef, TaskListProps>(({ boardId }, ref) => {
	const {
		filteredTasks,
		updateTask,
		updateSubTask,
		addTask,
		deleteTask,
		addSubTask,
		reorderTasks,
		isLoading,
	} = useTask();
	const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
	const [showAddField, setShowAddField] = useState(false);
	const [newField, setNewField] = useState<{ name: string; type: FieldType }>({
		name: "",
		type: "text",
	});
	const [selectedField, setSelectedField] = useState<Field | null>(null);
	const [showFieldSettings, setShowFieldSettings] = useState(false);
	const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({});
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
	const { toast } = useToast();
	const [showFieldType, setShowFieldType] = useState(false);

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
		setFields(fields.map((f) => (f.id === updatedField.id ? updatedField : f)));
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
			const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
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

	return (
		<div className="container max-w-full pb-20">
			<div className="flex justify-between mb-5 px-6 pt-6">
				<Button
					className="bg-[#1e293b] hover:bg-[#0f172a] text-white gap-2 px-4 py-2 h-auto"
					onClick={openAddTaskModal}
				>
					<Plus className="h-5 w-5" /> Добавить задачу
				</Button>

				<Button
					className="bg-[#1e293b] hover:bg-[#0f172a] text-white gap-2 px-4 py-2 h-auto"
					onClick={() => setShowAddField(true)}
				>
					<Plus className="h-5 w-5" /> Добавить поле
				</Button>
			</div>

			<div className="bg-[#2d2d2d] text-white">
				<div className="flex h-[60px] items-center font-medium">
					{fields.map((field) => (
						<div
							key={field.id}
							className={`${
								field.id === "task" ? "flex-1" : "w-[120px] flex-shrink-0"
							} flex items-center justify-center text-sm`}
						>
							{field.name}
							{field.id !== "task" && (
								<Filter className="h-3 w-3 ml-1 text-gray-400" />
							)}
						</div>
					))}
					<div className="w-[60px]"></div>
				</div>
			</div>

			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className="bg-white">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={getFilteredTasks().map((task) => task.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="task-list-container">
								{getFilteredTasks().map((task) => (
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
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				</div>
			)}

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
										setSelectedField({ ...selectedField, name: e.target.value })
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
													const newOptions = [...(selectedField.options || [])];
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
												options: [...(selectedField.options || []), newOption],
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
		</div>
	);
});

TaskList.displayName = "TaskList";

export default TaskList;
