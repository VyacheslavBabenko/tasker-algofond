
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

  const handleStatusChange = (status: "inProgress" | "take" | "check" | "blocked") => {
    if (onStatusChange) {
      onStatusChange(id, status);
    }
  };

  const handleSubTaskStatusChange = (subTaskId: string, status: "inProgress" | "take" | "check" | "blocked") => {
    if (onSubTaskStatusChange) {
      onSubTaskStatusChange(id, subTaskId, status);
    }
  };

  return (
    <>
      <div
        className="bg-white flex w-full items-center justify-between mt-1 pl-5 pr-5 py-3 rounded-lg cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-8">
          <div className="w-[100px]">{id}</div>
          <div className="w-[100px]">{date}</div>
          <div className="w-[120px]">{result}</div>
          <div className="w-[210px]">{object}</div>
          <div className="flex items-center gap-2 w-[400px] font-medium">
            <Circle className="h-4 w-4 fill-current text-black" />
            <div className="flex-1">{task}</div>
            {subTasks && subTasks.length > 0 && (
              expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
            )}
          </div>
          <StatusBadge 
            status={status} 
            label={statusLabel} 
            onStatusChange={handleStatusChange}
          />
          <div className="w-[130px]">{assignee}</div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-500" />
      </div>
      {expanded && subTasks && subTasks.length > 0 && (
        <div className="pl-[500px]">
          {subTasks.map((subTask, index) => (
            <div
              key={subTask.id}
              className={
                index === 0
                  ? "rounded-t-lg"
                  : index === subTasks.length - 1
                    ? "rounded-b-lg"
                    : ""
              }
            >
              <SubTask
                id={subTask.id}
                object={subTask.object}
                description={subTask.description}
                status={subTask.status}
                statusLabel={subTask.statusLabel}
                assignee={subTask.assignee}
                onStatusChange={handleSubTaskStatusChange}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TaskItem;
