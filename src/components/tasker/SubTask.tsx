
import React from "react";
import StatusBadge from "./StatusBadge";
import { Circle, MoreHorizontal } from "lucide-react";
import { SubTask as SubTaskType } from "@/contexts/TaskContext";

interface SubTaskProps extends SubTaskType {
  onStatusChange?: (status: "inProgress" | "take" | "check" | "blocked") => void;
}

const SubTask: React.FC<SubTaskProps> = ({
  id,
  object,
  description,
  status,
  statusLabel,
  assignee,
  onStatusChange
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
      <div className="w-[120px] flex-shrink-0 text-sm text-gray-600">{assignee}</div>
      <div className="flex w-[60px] justify-center text-gray-400">
        <MoreHorizontal className="h-5 w-5" />
      </div>
    </div>
  );
};

export default SubTask;
