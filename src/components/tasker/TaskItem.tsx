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
} from "lucide-react";
import { Task, SubTask as SubTaskType } from "@/contexts/TaskContext";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
}

const assigneeOptions = ["Дима", "Денис", "Женя", "Саша", "Дэ Хан"];

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
	...otherProps
}) => {
	const [expanded, setExpanded] = useState(false);
	const [showAddSubTask, setShowAddSubTask] = useState(false);
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

	// Применяем стили для перетаскивания
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 1 : 0,
	};

	const toggleExpand = () => {
		if (subTasks && subTasks.length > 0) {
			setExpanded(!expanded);
		}
	};

	const handleStatusChange = (
		newStatus: "inProgress" | "take" | "check" | "blocked"
	) => {
		if (onStatusChange) {
			onStatusChange(id, newStatus);
		}
	};

	const handleSubTaskStatusChange = (
		subTaskId: string,
		newStatus: "inProgress" | "take" | "check" | "blocked"
	) => {
		if (onSubTaskStatusChange) {
			onSubTaskStatusChange(id, subTaskId, newStatus);
		}
	};

	const handleAssigneeChange = (newAssignee: string) => {
		if (onAssigneeChange) {
			onAssigneeChange(id, newAssignee);
		}
	};

	const handleSubTaskAssigneeChange = (
		subTaskId: string,
		newAssignee: string
	) => {
		if (onSubTaskAssigneeChange) {
			onSubTaskAssigneeChange(id, subTaskId, newAssignee);
		}
	};

	const handleDeleteTask = () => {
		if (onDeleteTask) {
			onDeleteTask(id);
		}
	};

	const handleAddSubTask = () => {
		if (onAddSubTask && newSubTask.object && newSubTask.description) {
			onAddSubTask(id, newSubTask);
			setShowAddSubTask(false);
			setNewSubTask({
				object: "",
				description: "",
				status: "take",
				statusLabel: "Взять",
				assignee: "Дима",
			});
			if (!expanded) {
				setExpanded(true);
			}
			toast({
				title: "Подзадача добавлена",
				description: "Подзадача успешно добавлена к задаче",
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
		if (fieldId === "date") return "w-[100px]";
		if (fieldId === "status") return "w-[180px]";
		if (fieldId === "assignee") return "w-[120px]";
		if (fieldId === "task") return "flex-1";
		return "w-[120px]";
	};

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				className="border-t border-gray-100 cursor-pointer group bg-white"
			>
				<div className="flex items-center h-[60px] relative">
					{/* Иконка для перетаскивания */}
					<div
						className="w-[30px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab absolute left-1"
						{...attributes}
						{...listeners}
					>
						<GripVertical className="h-5 w-5 text-gray-400" />
					</div>

					{fields.map((field, index) => (
						<div
							key={field.id}
							className={`${getFieldWidthClass(field.id)} flex-shrink-0 ${
								field.id === "task" ? "flex items-center gap-2 pl-6" : "text-sm"
							} ${index === 0 ? "pl-8" : ""}`}
						>
							{field.id === "task" ? (
								<>
									<Circle className="h-5 w-5 stroke-current stroke-1 text-gray-400" />
									<div
										className="flex-1 text-base font-medium text-left"
										onClick={toggleExpand}
									>
										{task}
									</div>
									{subTasks &&
										subTasks.length > 0 &&
										(expanded ? (
											<ChevronUp className="h-4 w-4" />
										) : (
											<ChevronDown className="h-4 w-4" />
										))}
								</>
							) : (
								getFieldValue(field.id)
							)}
						</div>
					))}
					<div className="flex w-[60px] justify-center gap-2">
						<button
							className="text-gray-400 hover:text-gray-600"
							onClick={() => setShowAddSubTask(true)}
							title="Добавить подзадачу"
						>
							<Plus className="h-5 w-5" />
						</button>
						<button
							className="text-gray-400 hover:text-red-500"
							onClick={handleDeleteTask}
							title="Удалить задачу"
						>
							<Trash2 className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
			{expanded && subTasks && subTasks.length > 0 && (
				<div className="pl-[400px] bg-[#f9f9f9]">
					{subTasks.map((subTask) => (
						<SubTask
							key={subTask.id}
							{...subTask}
							onStatusChange={(status) =>
								handleSubTaskStatusChange(subTask.id, status)
							}
							onAssigneeChange={(assignee) =>
								handleSubTaskAssigneeChange(subTask.id, assignee)
							}
						/>
					))}
				</div>
			)}

			<Dialog open={showAddSubTask} onOpenChange={setShowAddSubTask}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Добавить подзадачу</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="object" className="text-right">
								Объект
							</label>
							<Input
								id="object"
								value={newSubTask.object}
								onChange={(e) =>
									setNewSubTask({ ...newSubTask, object: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="description" className="text-right">
								Описание
							</label>
							<Input
								id="description"
								value={newSubTask.description}
								onChange={(e) =>
									setNewSubTask({ ...newSubTask, description: e.target.value })
								}
								className="col-span-3"
							/>
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
		</>
	);
};

export default TaskItem;
