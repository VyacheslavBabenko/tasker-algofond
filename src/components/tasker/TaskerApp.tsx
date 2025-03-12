
import React, { useRef } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import TaskList, { TaskListRef } from "./TaskList";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskProvider } from "@/contexts/TaskContext";

const TaskerApp: React.FC = () => {
  const taskListRef = useRef<TaskListRef>(null);

  const handleAddTaskClick = () => {
    if (taskListRef.current) {
      taskListRef.current.openAddTaskModal();
    }
  };

  return (
    <TaskProvider>
      <Header />
      <div className="flex flex-col px-10 pb-10 min-h-screen bg-[#f9f9f9]">
        <div className="flex justify-between items-center mt-10">
          <h1 className="text-2xl font-bold">Основная доска</h1>
        </div>
        <FilterBar onAddTask={handleAddTaskClick} />
        <TaskList 
          boardId="main" 
          ref={taskListRef}
        />
      </div>
    </TaskProvider>
  );
};

export default TaskerApp;
