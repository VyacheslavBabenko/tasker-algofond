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

	const handleAddFieldClick = () => {
		if (taskListRef.current && taskListRef.current.openAddFieldModal) {
			taskListRef.current.openAddFieldModal();
		}
	};

	return (
		<TaskProvider>
			<Header />
			<div className="flex flex-col min-h-screen bg-[#f9f9f9]">
				<div className="flex-1 px-10">
					<div className="flex justify-between items-center mt-10">
						<h1 className="text-2xl font-bold">Основная доска</h1>
					</div>
					<TaskList boardId="main" ref={taskListRef} />
				</div>
				<div className="mt-auto sticky bottom-0 left-0 right-0 z-10">
					<FilterBar
						onAddTask={handleAddTaskClick}
						onAddField={handleAddFieldClick}
					/>
				</div>
			</div>
		</TaskProvider>
	);
};

export default TaskerApp;
