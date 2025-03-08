
import React from "react";
import StatusBadge from "./StatusBadge";
import { MoreHorizontal } from "lucide-react";
import { SubTask as SubTaskType } from "@/contexts/TaskContext";

interface SubTaskProps extends SubTaskType {
  onStatusChange?: (id: string, status: "inProgress" | "take" | "check" | "blocked") => void;
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
    <div className="bg-[#f1f1f5] flex w-full items-center justify-between px-5 py-3">
      <div className="flex items-center gap-8">
        <div className="w-[210px]">{object}</div>
        <div className="flex gap-2 items-center w-[400px]">
          <div className="flex-1">{description}</div>
        </div>
        <StatusBadge 
          status={status} 
          label={statusLabel} 
          onStatusChange={onStatusChange ? () => onStatusChange(id, status) : undefined}
        />
        <div className="w-[130px]">{assignee}</div>
      </div>
      <MoreHorizontal className="h-5 w-5 text-gray-500" />
    </div>
  );
};

export default SubTask;
