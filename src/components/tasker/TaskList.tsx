
import React from "react";
import TaskItem from "./TaskItem";
import { useTask } from "@/contexts/TaskContext";
import { ChevronDown, Filter } from "lucide-react";

const TaskList: React.FC = () => {
  const { filteredTasks, updateTask, updateSubTask } = useTask();

  const handleStatusChange = (id: string, status: "inProgress" | "take" | "check" | "blocked") => {
    let statusLabel = "";
    switch (status) {
      case "inProgress":
        statusLabel = "В работе";
        break;
      case "take":
        statusLabel = "Взять";
        break;
      case "check":
        statusLabel = "Проверить";
        break;
      case "blocked":
        statusLabel = "Блок софта";
        break;
    }
    
    updateTask(id, { status, statusLabel });
  };

  const handleSubTaskStatusChange = (
    taskId: string, 
    subTaskId: string, 
    status: "inProgress" | "take" | "check" | "blocked"
  ) => {
    let statusLabel = "";
    switch (status) {
      case "inProgress":
        statusLabel = "В работе";
        break;
      case "take":
        statusLabel = "Взять";
        break;
      case "check":
        statusLabel = "Проверить";
        break;
      case "blocked":
        statusLabel = "Блок софта";
        break;
    }
    
    updateSubTask(taskId, subTaskId, { status, statusLabel });
  };

  return (
    <div className="w-full text-lg mt-5 px-5">
      <div className="bg-[#2d2d2d] flex items-center gap-8 text-white font-medium px-5 py-4 rounded-lg">
        <div className="w-[100px]">ID</div>
        <div className="w-[100px]">Дата</div>
        <div className="w-[120px]">Результат</div>
        <div className="w-[210px]">Объект</div>
        <div className="w-[400px]">Задача</div>
        <div className="flex items-center gap-2">
          <div className="w-[120px]">Статус</div>
          <Filter className="h-4 w-4" />
        </div>
        <div className="w-[130px]">Исполнитель</div>
      </div>
      <div className="text-gray-700 mt-2">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            onStatusChange={handleStatusChange}
            onSubTaskStatusChange={handleSubTaskStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
