
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
        className="bg-white flex w-full items-center justify-between mt-2.5 pl-5 pr-10 py-5 rounded-[10px] cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-[60px]">
          <div className="w-[100px]">{id}</div>
          <div className="w-[100px]">{date}</div>
          <div className="w-[120px]">{result}</div>
          <div className="w-[210px]">{object}</div>
          <div className="flex items-center gap-2.5 font-medium w-[400px]">
            <Circle className="h-[18px] w-[18px] fill-current text-black" />
            <div className="flex-1 text-left">{task}</div>
            {subTasks && subTasks.length > 0 && (
              expanded ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />
            )}
          </div>
          <StatusBadge 
            status={status} 
            label={statusLabel} 
            onStatusChange={handleStatusChange}
          />
          <div className="w-[130px]">{assignee}</div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-[#929299]" />
      </div>
      {expanded && subTasks && subTasks.length > 0 && (
        <div className="pl-[500px]">
          {subTasks.map((subTask, index) => (
            <div
              key={subTask.id}
              className={
                index === 0
                  ? "rounded-t-[10px]"
                  : index === subTasks.length - 1
                    ? "rounded-b-[10px]"
                    : ""
              }
            >
              <SubTask
                {...subTask}
                onStatusChange={(status) => handleSubTaskStatusChange(subTask.id, status)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TaskItem;
