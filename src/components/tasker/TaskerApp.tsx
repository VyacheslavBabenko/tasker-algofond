import React from "react";
import Header from "./Header";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";

const TaskerApp: React.FC = () => {
  return (
    <div className="bg-[rgba(245,248,249,1)] overflow-hidden min-h-screen">
      <Header />
      <TaskList />
      <FilterBar />
    </div>
  );
};

export default TaskerApp;
