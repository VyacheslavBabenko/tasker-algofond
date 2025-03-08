
import React from "react";
import Header from "./Header";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";
import { TaskProvider } from "@/contexts/TaskContext";

const TaskerApp: React.FC = () => {
  return (
    <TaskProvider>
      <div className="bg-[#f5f8f9] min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 px-5">
          <TaskList />
        </div>
        <FilterBar />
      </div>
    </TaskProvider>
  );
};

export default TaskerApp;
