
import React from "react";
import { ChevronDown, Plus, List } from "lucide-react";
import { useTask } from "@/contexts/TaskContext";

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  active = false,
  onClick
}) => {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        active ? "bg-[#2d2d2d] text-white" : ""
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  );
};

const FilterBar: React.FC = () => {
  const { activeFilter, setFilter } = useTask();
  
  const filters = [
    "Все", "Март", "Денис", "Дима", "Дэ Хан", "Леша", 
    "Саша", "Женя", "Николай", "Насим", "Коля", "Илья"
  ];

  const handleAddTask = () => {
    // Открыть модальное окно для добавления задачи
    alert("Функция добавления задачи");
  };

  return (
    <div className="flex w-full mt-5 border-t border-gray-200">
      <div className="bg-white flex items-center gap-2 p-4 border-r border-gray-200">
        <button 
          className="bg-[#f1f1f5] p-3 rounded-lg"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button className="p-3 rounded-lg">
          <List className="h-4 w-4" />
        </button>
      </div>
      <div className="bg-white flex items-center gap-2 flex-1 px-4 py-2 overflow-x-auto">
        {filters.map((filter) => (
          <FilterButton
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setFilter(filter)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
