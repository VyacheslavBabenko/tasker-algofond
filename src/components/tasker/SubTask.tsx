
import React from "react";
import StatusBadge from "./StatusBadge";
import { Circle, MoreHorizontal, User } from "lucide-react";
import { SubTask as SubTaskType } from "@/contexts/TaskContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface SubTaskProps extends SubTaskType {
  onStatusChange?: (status: "inProgress" | "take" | "check" | "blocked") => void;
  onAssigneeChange?: (assignee: string) => void;
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
  onAssigneeChange
}) => {
  return (
    <div className="flex items-center h-[60px] border-t border-gray-100">
      <div className="ml-4 w-32 flex-shrink-0 text-sm text-gray-600">{object}</div>
      <div className="flex gap-2 items-center flex-1">
        <Circle className="h-5 w-5 stroke-current stroke-1 text-gray-400" />
        <div className="flex-1 text-sm text-left text-gray-700">{description}</div>
      </div>
      <div className="w-[180px] flex-shrink-0">
        <StatusBadge 
          status={status} 
          label={statusLabel} 
          onStatusChange={onStatusChange}
        />
      </div>
      <div className="w-[120px] flex-shrink-0 text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100">
            <User className="h-4 w-4 text-gray-500" />
            <span>{assignee}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {assigneeOptions.map(option => (
              <DropdownMenuItem 
                key={option}
                onClick={() => onAssigneeChange && onAssigneeChange(option)}
                className={assignee === option ? "bg-gray-100" : ""}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex w-[60px] justify-center text-gray-400">
        <MoreHorizontal className="h-5 w-5" />
      </div>
    </div>
  );
};

export default SubTask;
