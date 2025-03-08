import React from "react";

type StatusType = "inProgress" | "take" | "check" | "blocked";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "inProgress":
        return "bg-[rgba(207,255,176,1)]";
      case "take":
        return "bg-[rgba(255,208,208,1)]";
      case "check":
        return "bg-[rgba(134,134,134,1)] text-white";
      case "blocked":
        return "bg-[rgba(255,56,56,1)] text-white";
      default:
        return "bg-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "inProgress":
        return "https://cdn.builder.io/api/v1/image/assets/TEMP/f250aef1daf0ac95f0a97b7a1e51bc6f86169f8f80c7f05cfd72b52e164d97a2?placeholderIfAbsent=true";
      case "take":
        return "https://cdn.builder.io/api/v1/image/assets/TEMP/e2151faad0ee86a113941170b46c6f6442a2393a0dc6cbab9ef8f90641d17744?placeholderIfAbsent=true";
      case "check":
        return "https://cdn.builder.io/api/v1/image/assets/TEMP/268f8340f1e96cd5c50302f8c8cf9e48c6b2c7155f8b5566fc09dc9b80d93acf?placeholderIfAbsent=true";
      case "blocked":
        return "https://cdn.builder.io/api/v1/image/assets/TEMP/a253a3b89dc2993e600ef4fe17b8df728a9f91d52472ba94995cbb3536bcec13?placeholderIfAbsent=true";
      default:
        return "";
    }
  };

  const getIconClass = () => {
    switch (status) {
      case "inProgress":
        return "aspect-[2]";
      case "take":
        return "aspect-[1.67]";
      case "check":
        return "aspect-[2]";
      case "blocked":
        return "aspect-[1.67]";
      default:
        return "";
    }
  };

  return (
    <div
      className={`self-stretch flex items-center justify-between w-[170px] px-5 py-2.5 rounded-[10px] ${getStatusStyles()}`}
    >
      <div className="self-stretch my-auto">{label}</div>
      <img
        src={getStatusIcon()}
        className={`object-contain w-2.5 self-stretch shrink-0 my-auto ${getIconClass()}`}
        alt=""
      />
    </div>
  );
};

export default StatusBadge;
