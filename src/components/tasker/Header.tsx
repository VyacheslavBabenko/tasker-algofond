
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTask } from "@/contexts/TaskContext";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks } = useTask();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Можно добавить логику фильтрации по поиску
  };

  return (
    <div className="bg-white flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <div className="text-3xl font-medium">Таскер</div>
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-[#f1f1f5] w-[400px] px-10 py-2 rounded-lg text-gray-600"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default Header;
