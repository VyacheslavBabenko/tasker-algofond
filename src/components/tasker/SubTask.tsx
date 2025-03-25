import React from "react";
import StatusBadge from "./StatusBadge";
import { Circle, MoreHorizontal, User, Edit, CheckCircle2 } from "lucide-react";
import { SubTask as SubTaskType } from "@/contexts/TaskContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubTaskProps extends SubTaskType {
	onStatusChange?: (
		status: "inProgress" | "take" | "check" | "blocked"
	) => void;
	onAssigneeChange?: (assignee: string) => void;
	onEditClick?: () => void;
}

const assigneeOptions = ["Дима", "Денис", "Женя", "Саша", "Дэ Хан"];

const SubTask: React.FC<SubTaskProps> = ({
	id,
	object,
	description,
	status,
	statusLabel,
	assignee,
	onStatusChange,
	onAssigneeChange,
	onEditClick,
}) => {
	return (
		<div className="bg-white rounded-md border border-gray-200 p-3 flex flex-col gap-2 shadow-sm">
			<div className="flex justify-between items-start">
				<div className="flex gap-2 items-start">
					<div className="mt-0.5">
						{status === "inProgress" ? (
							<CheckCircle2 className="h-4 w-4 text-green-500" />
						) : (
							<Circle className="h-4 w-4 stroke-current stroke-1 text-gray-400" />
						)}
					</div>
					<div className="flex flex-col">
						<div className="font-medium text-sm">{object}</div>
						<div className="text-sm text-gray-600 mt-1">{description}</div>
					</div>
				</div>
				<button
					className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
					onClick={onEditClick}
					title="Редактировать подзадачу"
				>
					<Edit className="h-3.5 w-3.5" />
				</button>
			</div>

			<div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
				<StatusBadge
					status={status}
					label={statusLabel}
					onStatusChange={onStatusChange}
					compact={true}
				/>

				<DropdownMenu>
					<DropdownMenuTrigger className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 text-xs">
						<User className="h-3 w-3 text-gray-500" />
						<span>{assignee}</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{assigneeOptions.map((option) => (
							<DropdownMenuItem
								key={option}
								onClick={() => onAssigneeChange && onAssigneeChange(option)}
								className={`text-sm cursor-pointer ${
									assignee === option ? "bg-gray-100 font-medium" : ""
								}`}
							>
								{option}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default SubTask;
