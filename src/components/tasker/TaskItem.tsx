import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import SubTask from "./SubTask";

interface SubTaskData {
  object: string;
  description: string;
  status: "inProgress" | "take" | "check" | "blocked";
  statusLabel: string;
  assignee: string;
}

interface TaskItemProps {
  id: string;
  date: string;
  result: string;
  object: string;
  task: string;
  status: "inProgress" | "take" | "check" | "blocked";
  statusLabel: string;
  assignee: string;
  subTasks?: SubTaskData[];
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
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (subTasks && subTasks.length > 0) {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      <div
        className="bg-white flex w-full items-center justify-between mt-2.5 pl-5 pr-10 py-5 rounded-[10px] max-md:max-w-full max-md:pr-5"
        onClick={toggleExpand}
      >
        <div className="self-stretch flex min-w-60 items-center gap-[40px_60px] flex-wrap my-auto max-md:max-w-full">
          <div className="self-stretch w-[100px] my-auto">{id}</div>
          <div className="self-stretch w-[100px] my-auto">{date}</div>
          <div className="self-stretch w-[120px] my-auto">{result}</div>
          <div className="self-stretch w-[210px] my-auto">{object}</div>
          <div className="self-stretch flex min-w-60 gap-2.5 font-medium justify-center w-[400px] my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/396953630311cca15e2c7c16c3d5e61df71898654defd948d216ece652f78f29?placeholderIfAbsent=true"
              className="aspect-[0.9] object-contain w-[18px] shrink-0"
              alt=""
            />
            <div className="flex-1 shrink basis-[0%]">{task}</div>
            <img
              src={
                expanded
                  ? "https://cdn.builder.io/api/v1/image/assets/TEMP/094f3a9d3e4e219d728baf63744eff31eb00c32e81ccdc7fb4ddd8a97fd1d64d?placeholderIfAbsent=true"
                  : "https://cdn.builder.io/api/v1/image/assets/TEMP/e13488b14c746ca864c4df83515b9115de0e7899631f8c1b3032c5f2fac1d94b?placeholderIfAbsent=true"
              }
              className="aspect-[0.71] object-contain w-2.5 shrink-0"
              alt=""
            />
          </div>
          <StatusBadge status={status} label={statusLabel} />
          <div className="self-stretch w-[130px] my-auto">{assignee}</div>
        </div>
        {subTasks && subTasks.length > 0 && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ae3494ab197b90a7edf743e2f5560ea2d5175d43df3431fdcfe444fec624b68?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
            alt=""
          />
        )}
      </div>
      {expanded && subTasks && subTasks.length > 0 && (
        <div className="w-full pl-[500px] max-md:max-w-full max-md:pl-5">
          {subTasks.map((subTask, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? "rounded-[10px_10px_0px_0px]"
                  : index === subTasks.length - 1
                    ? "rounded-[0px_0px_10px_10px]"
                    : ""
              }
            >
              <SubTask
                object={subTask.object}
                description={subTask.description}
                status={subTask.status}
                statusLabel={subTask.statusLabel}
                assignee={subTask.assignee}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TaskItem;
