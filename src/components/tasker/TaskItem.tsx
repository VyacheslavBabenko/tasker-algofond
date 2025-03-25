import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import SubTask from "./SubTask";
import {
	ChevronDown,
	ChevronUp,
	Circle,
	MoreHorizontal,
	User,
	Plus,
	Trash2,
	GripVertical,
	Edit,
} from "lucide-react";
import { Task, SubTask as SubTaskType } from "@/contexts/TaskContext";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Label } from "@/components/ui/label";

interface Field {
	id: string;
	name: string;
	type: "text" | "number" | "list";
	options?: Array<{ id: string; value: string; color: string }>;
}

interface TaskItemProps extends Task {
	fields?: Field[];
	onStatusChange?: (
		id: string,
		status: "inProgress" | "take" | "check" | "blocked"
	) => void;
	onSubTaskStatusChange?: (
		taskId: string,
		subTaskId: string,
		status: "inProgress" | "take" | "check" | "blocked"
	) => void;
	onAssigneeChange?: (id: string, assignee: string) => void;
	onSubTaskAssigneeChange?: (
		taskId: string,
		subTaskId: string,
		assignee: string
	) => void;
	onDeleteTask?: (id: string) => void;
	onAddSubTask?: (taskId: string, subTask: Omit<SubTaskType, "id">) => void;
	onEditTask?: (id: string, updatedTask: Partial<Task>) => void;
	onEditSubTask?: (
		taskId: string,
		subTaskId: string,
		updatedSubTask: Partial<SubTaskType>
	) => void;
	className?: string;
}

const assigneeOptions = ["Дима", "Денис", "Женя", "Саша", "Дэ Хан"];
const statusOptions = [
	{ value: "inProgress", label: "В работе" },
	{ value: "take", label: "Взять" },
	{ value: "check", label: "Проверить" },
	{ value: "blocked", label: "Блок софта" },
];

const TaskItem: React.FC<TaskItemProps> = ({
	id,
	date,
	result,
	object,
	task,
	status,
	statusLabel,
	assignee,
	subTasks,
	fields = [],
	onStatusChange,
	onSubTaskStatusChange,
	onAssigneeChange,
	onSubTaskAssigneeChange,
	onDeleteTask,
	onAddSubTask,
	onEditTask,
	onEditSubTask,
	className,
	...otherProps
}) => {
	const [expanded, setExpanded] = useState(false);
	const [showAddSubTask, setShowAddSubTask] = useState(false);
	const [showEditTask, setShowEditTask] = useState(false);
	const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
	const [editedTask, setEditedTask] = useState<Partial<Task>>({});
	const [editedSubTask, setEditedSubTask] = useState<Partial<SubTaskType>>({});
	const [newSubTask, setNewSubTask] = useState<Omit<SubTaskType, "id">>({
		object: "",
		description: "",
		status: "take",
		statusLabel: "Взять",
		assignee: "Дима",
	});
	const { toast } = useToast();

	// Используем хук useSortable для включения функциональности перетаскивания
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const toggleExpanded = () => setExpanded(!expanded);

	const handleStatusChange = (newStatus: string) => {
		if (onStatusChange) {
			const statusValue = newStatus as
				| "inProgress"
				| "take"
				| "check"
				| "blocked";
			onStatusChange(id, statusValue);
		}
	};

	const handleAssigneeChange = (newAssignee: string) => {
		if (onAssigneeChange) {
			onAssigneeChange(id, newAssignee);
		}
	};

	const handleDeleteTask = () => {
		if (onDeleteTask) {
			onDeleteTask(id);
		}
	};

	const handleAddSubTask = () => {
		if (onAddSubTask) {
			onAddSubTask(id, newSubTask);
			setNewSubTask({
				object: "",
				description: "",
				status: "take",
				statusLabel: "Взять",
				assignee: "Дима",
			});
			setShowAddSubTask(false);
			setExpanded(true); // Автоматически раскрываем задачу, чтобы показать подзадачу
		}
	};

	// Инициализация редактирования задачи
	const startEditTask = () => {
		setEditedTask({
			object,
			task,
			result,
			date,
			status,
			assignee,
		});
		setShowEditTask(true);
	};

	// Сохранение изменений задачи
	const saveTaskEdit = () => {
		if (onEditTask && editedTask) {
			// Находим правильный statusLabel для выбранного статуса
			const selectedStatus = statusOptions.find(
				(s) => s.value === editedTask.status
			);
			const updatedTask = {
				...editedTask,
				statusLabel: selectedStatus?.label || statusLabel,
			};

			onEditTask(id, updatedTask);
			setShowEditTask(false);
			toast({
				title: "Задача обновлена",
				description: "Изменения успешно сохранены",
			});
		}
	};

	// Инициализация редактирования подзадачи
	const startEditSubTask = (subTaskId: string, subTask: SubTaskType) => {
		setEditedSubTask({
			object: subTask.object,
			description: subTask.description,
			status: subTask.status,
			assignee: subTask.assignee,
		});
		setEditingSubTaskId(subTaskId);
	};

	// Сохранение изменений подзадачи
	const saveSubTaskEdit = () => {
		if (onEditSubTask && editingSubTaskId && editedSubTask) {
			// Находим правильный statusLabel для выбранного статуса
			const selectedStatus = statusOptions.find(
				(s) => s.value === editedSubTask.status
			);
			const updatedSubTask = {
				...editedSubTask,
				statusLabel: selectedStatus?.label || "",
			};

			onEditSubTask(id, editingSubTaskId, updatedSubTask);
			setEditingSubTaskId(null);
			toast({
				title: "Подзадача обновлена",
				description: "Изменения успешно сохранены",
			});
		}
	};

	// Функция для получения значения поля
	const getFieldValue = (fieldId: string) => {
		if (fieldId === "id") return id;
		if (fieldId === "date") return date;
		if (fieldId === "result") return result;
		if (fieldId === "object") return object;
		if (fieldId === "task") return task;
		if (fieldId === "status")
			return (
				<StatusBadge
					status={status}
					label={statusLabel}
					onStatusChange={handleStatusChange}
				/>
			);
		if (fieldId === "assignee")
			return (
				<DropdownMenu>
					<DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100">
						<User className="h-4 w-4 text-gray-500" />
						<span>{assignee}</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{assigneeOptions.map((option) => (
							<DropdownMenuItem
								key={option}
								onClick={() => handleAssigneeChange(option)}
								className={assignee === option ? "bg-gray-100" : ""}
							>
								{option}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			);

		// Для пользовательских полей
		return otherProps[fieldId] || "";
	};

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

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`relative bg-white transition-colors hover:bg-gray-50 ${
				isDragging ? "opacity-50 z-50" : ""
			} ${expanded ? "shadow-sm" : ""} ${className || ""}`}
		>
			{/* Основная строка задачи */}
			<div className="flex items-center min-h-[56px] group">
				{/* Кнопка раскрытия/закрытия */}
				<div className="w-[50px] flex justify-center">
					<button
						onClick={toggleExpanded}
						className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
					>
						{expanded ? (
							<ChevronUp className="h-4 w-4 text-gray-600" />
						) : (
							<ChevronDown className="h-4 w-4 text-gray-600" />
						)}
					</button>
				</div>

				{/* Drag handle */}
				<div className="w-[30px] flex items-center justify-center">
					<div
						className="cursor-grab opacity-0 group-hover:opacity-100 p-1 transition-opacity"
						{...attributes}
						{...listeners}
					>
						<GripVertical className="h-4 w-4 text-gray-500" />
					</div>
				</div>

				{/* Ячейки данных */}
				{fields?.map((field) => (
					<div
						key={field.id}
						className={`${getFieldWidthClass(
							field.id
						)} px-4 py-2 truncate flex items-center`}
					>
						{field.id === "status" ? (
							<StatusBadge status={status} label={statusLabel} />
						) : field.id === "assignee" ? (
							<div className="flex items-center gap-2">
								<div className="bg-blue-100 text-blue-800 p-1 rounded-full">
									<User className="h-3 w-3" />
								</div>
								<span>{assignee}</span>
							</div>
						) : (
							<div className="truncate">
								<div
									className={`${
										field.id === "task" ? "font-medium" : "text-gray-600"
									} text-sm`}
									title={String(getFieldValue(field.id) || "")}
								>
									{getFieldValue(field.id) || "-"}
								</div>
							</div>
						)}
					</div>
				))}

				{/* Действия */}
				<div className="w-[50px] flex justify-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="p-1.5 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
								<MoreHorizontal className="h-4 w-4 text-gray-600" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[180px]">
							<DropdownMenuItem
								onClick={startEditTask}
								className="cursor-pointer"
							>
								<Edit className="mr-2 h-4 w-4" />
								Редактировать
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setShowAddSubTask(true)}
								className="cursor-pointer"
							>
								<Plus className="mr-2 h-4 w-4" />
								Добавить подзадачу
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleDeleteTask}
								className="cursor-pointer text-red-500 focus:text-red-500"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Удалить
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Раскрывающийся контент с подзадачами */}
			{expanded && (
				<div className="border-t border-gray-100 bg-gray-50 p-4 pl-[80px]">
					{/* Результат */}
					{result && (
						<div className="mb-4">
							<div className="text-xs font-medium text-gray-500 mb-1">
								Результат:
							</div>
							<div className="text-sm text-gray-700">{result}</div>
						</div>
					)}

					{/* Подзадачи */}
					{subTasks && subTasks.length > 0 && (
						<div className="mt-4">
							<div className="text-xs font-medium text-gray-500 mb-2">
								Подзадачи:
							</div>
							<div className="space-y-2 mt-2">
								{subTasks.map((subTask) => (
									<div key={subTask.id} className="relative">
										{editingSubTaskId === subTask.id ? (
											<div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
												<div className="mb-3">
													<Label className="text-xs mb-1">Объект</Label>
													<Input
														size={1}
														value={editedSubTask.object || ""}
														onChange={(e) =>
															setEditedSubTask({
																...editedSubTask,
																object: e.target.value,
															})
														}
														className="mt-1"
													/>
												</div>
												<div className="mb-3">
													<Label className="text-xs mb-1">Описание</Label>
													<Textarea
														value={editedSubTask.description || ""}
														onChange={(e) =>
															setEditedSubTask({
																...editedSubTask,
																description: e.target.value,
															})
														}
														className="mt-1"
														rows={3}
													/>
												</div>
												<div className="flex gap-3 justify-end">
													<Button
														variant="outline"
														size="sm"
														onClick={() => setEditingSubTaskId(null)}
													>
														Отмена
													</Button>
													<Button size="sm" onClick={saveSubTaskEdit}>
														Сохранить
													</Button>
												</div>
											</div>
										) : (
											<SubTask
												{...subTask}
												onStatusChange={(status) =>
													onSubTaskStatusChange?.(id, subTask.id, status)
												}
												onAssigneeChange={(assignee) =>
													onSubTaskAssigneeChange?.(id, subTask.id, assignee)
												}
												onEditClick={() =>
													startEditSubTask(subTask.id, subTask)
												}
											/>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Кнопка "Добавить подзадачу" */}
					{!subTasks?.length && (
						<Button
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={() => setShowAddSubTask(true)}
						>
							<Plus className="mr-2 h-3.5 w-3.5" />
							Добавить подзадачу
						</Button>
					)}
				</div>
			)}

			{/* Диалоговые окна */}

			{/* Диалог добавления подзадачи */}
			<Dialog open={showAddSubTask} onOpenChange={setShowAddSubTask}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Добавить подзадачу</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="object">Объект</Label>
							<Input
								id="object"
								value={newSubTask.object}
								onChange={(e) =>
									setNewSubTask({ ...newSubTask, object: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="description">Описание</Label>
							<Textarea
								id="description"
								value={newSubTask.description}
								onChange={(e) =>
									setNewSubTask({ ...newSubTask, description: e.target.value })
								}
								rows={3}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="status">Статус</Label>
								<select
									id="status"
									value={newSubTask.status}
									onChange={(e) =>
										setNewSubTask({
											...newSubTask,
											status: e.target.value as
												| "inProgress"
												| "take"
												| "check"
												| "blocked",
											statusLabel:
												statusOptions.find(
													(opt) => opt.value === e.target.value
												)?.label || "",
										})
									}
									className="p-2 border rounded-md"
								>
									{statusOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="assignee">Исполнитель</Label>
								<select
									id="assignee"
									value={newSubTask.assignee}
									onChange={(e) =>
										setNewSubTask({ ...newSubTask, assignee: e.target.value })
									}
									className="p-2 border rounded-md"
								>
									{assigneeOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowAddSubTask(false)}>
							Отмена
						</Button>
						<Button onClick={handleAddSubTask}>Добавить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Диалог редактирования задачи */}
			<Dialog open={showEditTask} onOpenChange={setShowEditTask}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Редактировать задачу</DialogTitle>
						<DialogDescription>
							Измените детали задачи и сохраните изменения
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-object">Объект</Label>
							<Input
								id="edit-object"
								value={editedTask.object || ""}
								onChange={(e) =>
									setEditedTask({ ...editedTask, object: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-task">Задача</Label>
							<Input
								id="edit-task"
								value={editedTask.task || ""}
								onChange={(e) =>
									setEditedTask({ ...editedTask, task: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-result">Результат</Label>
							<Textarea
								id="edit-result"
								value={editedTask.result || ""}
								onChange={(e) =>
									setEditedTask({ ...editedTask, result: e.target.value })
								}
								rows={3}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-date">Дата</Label>
								<Input
									id="edit-date"
									value={editedTask.date || ""}
									onChange={(e) =>
										setEditedTask({ ...editedTask, date: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-assignee">Исполнитель</Label>
								<select
									id="edit-assignee"
									value={editedTask.assignee || ""}
									onChange={(e) =>
										setEditedTask({ ...editedTask, assignee: e.target.value })
									}
									className="p-2 border rounded-md"
								>
									{assigneeOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-status">Статус</Label>
							<select
								id="edit-status"
								value={editedTask.status || ""}
								onChange={(e) =>
									setEditedTask({
										...editedTask,
										status: e.target.value as
											| "inProgress"
											| "take"
											| "check"
											| "blocked",
									})
								}
								className="p-2 border rounded-md"
							>
								{statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowEditTask(false)}>
							Отмена
						</Button>
						<Button onClick={saveTaskEdit}>Сохранить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default TaskItem;
