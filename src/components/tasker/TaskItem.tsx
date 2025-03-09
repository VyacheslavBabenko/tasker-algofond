
import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import SubTask from "./SubTask";
import { ChevronDown, ChevronUp, Circle, MoreHorizontal, User } from "lucide-react";
import { Task, SubTask as SubTaskType } from "@/contexts/TaskContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TaskItemProps extends Task {
  onStatusChange?: (id: string, status: "inProgress" | "take" | "check" | "blocked") => void;
  onSubTaskStatusChange?: (taskId: string, subTaskId: string, status: "inProgress" | "take" | "check" | "blocked") => void;
  onAssigneeChange?: (id: string, assignee: string) => void;
  onSubTaskAssigneeChange?: (taskId: string, subTaskId: string, assignee: string) => void;
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
  onStatusChange,
  onSubTaskStatusChange,
  onAssigneeChange,
  onSubTaskAssigneeChange
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (subTasks && subTasks.length > 0) {
      setExpanded(!expanded);
    }
  };

  const handleStatusChange = (newStatus: "inProgress" | "take" | "check" | "blocked") => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const handleSubTaskStatusChange = (subTaskId: string, newStatus: "inProgress" | "take" | "check" | "blocked") => {
    if (onSubTaskStatusChange) {
      onSubTaskStatusChange(id, subTaskId, newStatus);
    }
  };

  const handleAssigneeChange = (newAssignee: string) => {
    if (onAssigneeChange) {
      onAssigneeChange(id, newAssignee);
    }
  };

  const handleSubTaskAssigneeChange = (subTaskId: string, newAssignee: string) => {
    if (onSubTaskAssigneeChange) {
      onSubTaskAssigneeChange(id, subTaskId, newAssignee);
    }
  };

  return (
    <>
      <div className="border-t border-gray-100 cursor-pointer">
        <div 
          className="flex items-center h-[60px]"
        >
          <div className="w-[60px] flex-shrink-0 text-sm text-center">{id}</div>
          <div className="w-[100px] flex-shrink-0 text-sm">{date}</div>
          <div className="w-[120px] flex-shrink-0 text-sm">{result}</div>
          <div className="w-[120px] flex-shrink-0 text-sm">{object}</div>
          <div className="flex items-center gap-2 flex-1 pl-6" onClick={toggleExpand}>
            <Circle className="h-5 w-5 stroke-current stroke-1 text-gray-400" />
            <div className="flex-1 text-base font-medium text-left">{task}</div>
            {subTasks && subTasks.length > 0 && (
              expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
            )}
          </div>
          <div className="w-[180px] flex-shrink-0">
            <StatusBadge 
              status={status} 
              label={statusLabel} 
              onStatusChange={handleStatusChange}
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
                    onClick={() => handleAssigneeChange(option)}
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
      </div>
      {expanded && subTasks && subTasks.length > 0 && (
        <div className="pl-[400px] bg-[#f9f9f9]">
          {subTasks.map((subTask) => (
            <SubTask
              key={subTask.id}
              {...subTask}
              onStatusChange={(status) => handleSubTaskStatusChange(subTask.id, status)}
              onAssigneeChange={(assignee) => handleSubTaskAssigneeChange(subTask.id, assignee)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TaskItem;
