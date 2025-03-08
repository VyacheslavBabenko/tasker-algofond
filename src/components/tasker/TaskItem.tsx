
import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import SubTask from "./SubTask";
import { ChevronDown, ChevronUp, Circle, MoreHorizontal } from "lucide-react";
import { Task, SubTask as SubTaskType } from "@/contexts/TaskContext";

interface TaskItemProps extends Task {
  onStatusChange?: (id: string, status: "inProgress" | "take" | "check" | "blocked") => void;
  onSubTaskStatusChange?: (taskId: string, subTaskId: string, status: "inProgress" | "take" | "check" | "blocked") => void;
}

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
  onSubTaskStatusChange
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

  return (
    <>
      <div className="border-t border-gray-100 cursor-pointer">
        <div 
          className="flex items-center h-[60px]"
          onClick={toggleExpand}
        >
          <div className="w-[60px] flex-shrink-0 text-sm text-center">{id}</div>
          <div className="w-[100px] flex-shrink-0 text-sm">{date}</div>
          <div className="w-[120px] flex-shrink-0 text-sm">{result}</div>
          <div className="w-[120px] flex-shrink-0 text-sm">{object}</div>
          <div className="flex items-center gap-2 flex-1">
            <Circle className="h-5 w-5 fill-black" />
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
          <div className="w-[120px] flex-shrink-0 text-sm">{assignee}</div>
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
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TaskItem;
