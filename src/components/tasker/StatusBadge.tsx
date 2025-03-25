import React from "react";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StatusType = "inProgress" | "take" | "check" | "blocked";

interface StatusBadgeProps {
	status: StatusType;
	label: string;
	onStatusChange?: (status: StatusType) => void;
	compact?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
	status,
	label,
	onStatusChange,
	compact = false,
}) => {
	const getStatusStyles = () => {
		switch (status) {
			case "inProgress":
				return "bg-emerald-100 text-emerald-800 border border-emerald-200";
			case "take":
				return "bg-amber-100 text-amber-800 border border-amber-200";
			case "check":
				return "bg-gray-100 text-gray-800 border border-gray-200";
			case "blocked":
				return "bg-red-100 text-red-800 border border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border border-gray-200";
		}
	};

	const handleStatusChange = (newStatus: StatusType) => {
		if (onStatusChange) {
			onStatusChange(newStatus);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={compact ? "w-auto" : "w-full"}>
				<div
					className={`flex items-center justify-between rounded-md ${
						compact ? "px-2 py-1 text-xs" : "px-3 py-2 min-w-[140px]"
					} ${getStatusStyles()}`}
				>
					<span className={`${compact ? "text-xs" : "text-sm"} font-medium`}>
						{label}
					</span>
					<ChevronDown
						className={`${compact ? "h-3 w-3 ml-1" : "h-4 w-4 ml-2"}`}
					/>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={compact ? "start" : "center"}>
				<DropdownMenuItem onClick={() => handleStatusChange("inProgress")}>
					В работе
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleStatusChange("take")}>
					Взять
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleStatusChange("check")}>
					Проверить
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleStatusChange("blocked")}>
					Блок софта
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default StatusBadge;
