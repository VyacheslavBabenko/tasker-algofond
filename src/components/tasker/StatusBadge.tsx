import React from "react";
import { ChevronDown } from "lucide-react";

type StatusType = "inProgress" | "take" | "check" | "blocked";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showDropdown?: boolean;
  onStatusChange?: (status: StatusType) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  showDropdown = true,
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

  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg ${getStatusStyles()}`}
      style={{ width: "150px" }}
    >
      <div>{label}</div>
      {showDropdown && (
        <ChevronDown 
          className="h-4 w-4" 
          onClick={(e) => {
            e.stopPropagation();
            // Тут можно добавить выпадающий список для изменения статуса
          }}
        />
      )}
    </div>
  );
};

export default StatusBadge;
