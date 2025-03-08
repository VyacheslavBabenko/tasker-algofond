
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
      <div
        className="bg-white flex items-center border-b border-gray-100 py-4 px-6 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="w-10 flex-shrink-0 text-sm">{id}</div>
        <div className="w-16 flex-shrink-0 text-sm">{date}</div>
        <div className="w-24 flex-shrink-0 text-sm">{result}</div>
        <div className="w-28 flex-shrink-0 text-sm">{object}</div>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Circle className="h-4 w-4 fill-current text-black" />
          <div className="flex-1 text-base font-medium text-left">{task}</div>
          {subTasks && subTasks.length > 0 && (
            expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </div>
        <div className="w-[170px] flex-shrink-0">
          <StatusBadge 
            status={status} 
            label={statusLabel} 
            onStatusChange={handleStatusChange}
          />
        </div>
        <div className="w-32 flex-shrink-0 text-sm">{assignee}</div>
        <div className="ml-4 text-gray-400">
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </div>
      {expanded && subTasks && subTasks.length > 0 && (
        <div className="pl-[400px]">
          {subTasks.map((subTask, index) => (
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
