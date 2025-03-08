
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTask } from "@/contexts/TaskContext";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSearchTerm } = useTask();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchTerm(value);
  };

  return (
    <div className="bg-white flex items-center justify-between px-10 py-4 border-b border-[#e3e3e3]">
      <div className="text-3xl font-medium text-[#2d2d2d]">Таскер</div>
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-[#f1f1f5] w-[398px] pl-10 pr-5 py-[9px] rounded-[10px] text-[#929299]"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#929299]" />
      </div>
    </div>
  );
};

export default Header;
