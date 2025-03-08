
import React from "react";
import { ChevronDown } from "lucide-react";

type StatusType = "inProgress" | "take" | "check" | "blocked";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  onStatusChange?: (status: StatusType) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  onStatusChange 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "inProgress":
        return "bg-[#cffeb0] text-black";
      case "take":
        return "bg-[#ffd0d0] text-black";
      case "check":
        return "bg-[#868686] text-white";
      case "blocked":
        return "bg-[#ff3838] text-white";
      default:
        return "bg-gray-200 text-black";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Здесь можно добавить логику для смены статуса
    const newStatus = getNextStatus(status);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const getNextStatus = (currentStatus: StatusType): StatusType => {
    switch (currentStatus) {
      case "inProgress":
        return "check";
      case "take":
        return "inProgress";
      case "check":
        return "blocked";
      case "blocked":
        return "take";
      default:
        return "take";
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 px-5 py-2.5 rounded-[10px] ${getStatusStyles()}`}
      style={{ width: "170px" }}
    >
      <div>{label}</div>
      <ChevronDown 
        className="h-2.5 w-2.5" 
        onClick={handleClick}
      />
    </div>
  );
};

export default StatusBadge;
