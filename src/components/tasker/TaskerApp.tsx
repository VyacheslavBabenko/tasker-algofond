
import React, { useState } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import TaskList from "./TaskList";
import BoardHeader from "./BoardHeader";
import { TaskProvider } from "@/contexts/TaskContext";

const TaskerApp: React.FC = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskListRef, setTaskListRef] = useState<any>(null);

  const handleAddTaskClick = () => {
    if (taskListRef && taskListRef.openAddTaskModal) {
      taskListRef.openAddTaskModal();
    }
  };

  return (
    <TaskProvider>
      <Header />
      <div className="flex flex-col px-10 pb-10 min-h-screen bg-[#f9f9f9]">
        <BoardHeader />
        <FilterBar onAddTask={handleAddTaskClick} />
        <TaskList 
          boardId="main" 
          ref={(ref) => setTaskListRef(ref)}
        />
      </div>
    </TaskProvider>
  );
};

export default TaskerApp;
