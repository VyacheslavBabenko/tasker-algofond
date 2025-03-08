import React from "react";
import StatusBadge from "./StatusBadge";

interface SubTaskProps {
  object: string;
  description: string;
  status: "inProgress" | "take" | "check" | "blocked";
  statusLabel: string;
  assignee: string;
}

const SubTask: React.FC<SubTaskProps> = ({
  object,
  description,
  status,
  statusLabel,
  assignee,
}) => {
  return (
    <div className="bg-[rgba(241,241,245,1)] flex w-full items-center gap-[40px_100px] justify-between flex-wrap pl-5 pr-10 py-5 max-md:max-w-full max-md:pr-5">
      <div className="self-stretch flex min-w-60 items-center gap-[40px_60px] flex-wrap my-auto max-md:max-w-full">
        <div className="self-stretch w-[210px] my-auto">{object}</div>
        <div className="self-stretch flex min-w-60 gap-2.5 w-[400px] my-auto">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f8950a79334b89aed54562a99c10d6b679052ac38bb1744193557ffb68f0b4cc?placeholderIfAbsent=true"
            className="aspect-[0.86] object-contain w-[18px] shrink-0"
            alt=""
          />
          <div className="flex-1 shrink basis-[0%]">{description}</div>
        </div>
        <StatusBadge status={status} label={statusLabel} />
        <div className="self-stretch w-[130px] my-auto">{assignee}</div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ae3494ab197b90a7edf743e2f5560ea2d5175d43df3431fdcfe444fec624b68?placeholderIfAbsent=true"
        className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
        alt=""
      />
    </div>
  );
};

export default SubTask;
