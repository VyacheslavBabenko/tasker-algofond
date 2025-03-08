
import React, { useState } from "react";
import Header from "./Header";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";
import BoardHeader from "./BoardHeader";
import { TaskProvider } from "@/contexts/TaskContext";
import { Settings } from "lucide-react";

const TaskerApp: React.FC = () => {
  const [boards, setBoards] = useState([{ id: "1", name: "Основная" }]);
  const [activeBoard, setActiveBoard] = useState("1");
  const [showBoardSettings, setShowBoardSettings] = useState(false);

  const handleAddBoard = () => {
    const newBoard = {
      id: (boards.length + 1).toString(),
      name: "Новая"
    };
    setBoards([...boards, newBoard]);
    setActiveBoard(newBoard.id);
  };

  const handleRenameBoard = (id: string, name: string) => {
    setBoards(boards.map(board => 
      board.id === id ? { ...board, name } : board
    ));
  };

  const handleDeleteBoard = (id: string) => {
    const newBoards = boards.filter(board => board.id !== id);
    setBoards(newBoards);
    
    if (activeBoard === id && newBoards.length > 0) {
      setActiveBoard(newBoards[0].id);
    }
  };

  const toggleBoardSettings = () => {
    setShowBoardSettings(!showBoardSettings);
  };

  return (
    <TaskProvider>
      <div className="bg-[#f5f8f9] min-h-screen flex flex-col">
        <Header />
        
        <div className="px-10 py-4 flex items-center justify-between border-b border-[#e3e3e3]">
          <div className="flex items-center gap-5">
            <h2 className="text-xl font-medium">Область: Проект</h2>
            <button 
              className="p-2 rounded-md hover:bg-gray-200"
              onClick={toggleBoardSettings}
            >
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex gap-4">
            {boards.map(board => (
              <button
                key={board.id}
                className={`px-4 py-2 rounded-md ${activeBoard === board.id ? 'bg-[#2d2d2d] text-white' : 'bg-white text-black'}`}
                onClick={() => setActiveBoard(board.id)}
              >
                {board.name}
              </button>
            ))}
            <button 
              className="bg-white px-4 py-2 rounded-md flex items-center"
              onClick={handleAddBoard}
            >
              <span className="mr-1">+</span> Доска
            </button>
          </div>
        </div>

        <BoardHeader 
          activeBoard={boards.find(b => b.id === activeBoard) || boards[0]} 
          onRename={handleRenameBoard} 
          onDelete={handleDeleteBoard}
          showSettings={showBoardSettings}
          onCloseSettings={() => setShowBoardSettings(false)}
        />
        
        <div className="flex-1">
          <TaskList boardId={activeBoard} />
        </div>
        <FilterBar />
      </div>
    </TaskProvider>
  );
};

export default TaskerApp;
