
import React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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

  const handleStatusChange = (newStatus: StatusType) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-md ${getStatusStyles()}`}
        >
          <span className="text-sm">{label}</span>
          <ChevronDown className="h-3 w-3 ml-2" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleStatusChange("inProgress")}>
          В работе
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("take")}>
          Взять
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("check")}>
          Проверить
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("blocked")}>
          Блок софта
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusBadge;
