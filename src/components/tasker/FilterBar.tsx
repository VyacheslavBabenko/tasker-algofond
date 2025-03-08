
import React from "react";
import { ChevronDown, Plus, List } from "lucide-react";
import { useTask } from "@/contexts/TaskContext";

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  width?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  active = false,
  onClick,
  width = "w-28"
}) => {
  return (
    <button
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[10px] ${width} ${
        active ? "bg-[#2d2d2d] text-white" : ""
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronDown className="h-2.5 w-2.5" />
    </button>
  );
};

const FilterBar: React.FC = () => {
  const { activeFilter, setFilter } = useTask();
  
  const filters = [
    { name: "Все", width: "w-[95px]" },
    { name: "Март", width: "w-[110px]" },
    { name: "Денис", width: "w-[120px]" },
    { name: "Дима", width: "w-[113px]" },
    { name: "Дэ Хан", width: "w-[126px]" },
    { name: "Леша", width: "w-[113px]" },
    { name: "Саша", width: "w-28" },
    { name: "Женя", width: "w-[113px]" },
    { name: "Николай", width: "w-[142px]" },
    { name: "Насим", width: "w-[123px]" },
    { name: "Коля", width: "w-[107px]" },
    { name: "Илья", width: "w-[109px]" }
  ];

  const handleAddTask = () => {
    // Функция добавления задачи
    console.log("Добавление новой задачи");
  };

  return (
    <div className="flex w-full mt-10">
      <div className="bg-white flex items-center gap-2.5 p-4 border-t border-r border-[#e3e3e3]">
        <button 
          className="bg-[#f1f1f5] p-3 rounded-[10px]"
          onClick={handleAddTask}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button className="p-3 rounded-[10px]">
          <List className="h-4 w-4" />
        </button>
      </div>
      <div className="bg-white flex items-center gap-5 flex-1 px-10 py-4 overflow-x-auto border-t border-[#e3e3e3]">
        {filters.map((filter) => (
          <FilterButton
            key={filter.name}
            label={filter.name}
            active={activeFilter === filter.name}
            onClick={() => setFilter(filter.name)}
            width={filter.width}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
