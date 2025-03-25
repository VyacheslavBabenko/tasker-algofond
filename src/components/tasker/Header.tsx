import React, { useState } from "react";
import {
	Search,
	Bell,
	User,
	Settings,
	LogOut,
	ChevronDown,
} from "lucide-react";
import { useTask } from "@/contexts/TaskContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const { setSearchTerm } = useTask();
	const [notifications, setNotifications] = useState(3); // Количество уведомлений для демонстрации

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setSearchTerm(value);
	};

	const clearNotifications = () => {
		setNotifications(0);
	};

	return (
		<div className="bg-white flex items-center justify-between px-10 py-3 border-b border-[#e3e3e3] sticky top-0 z-20">
			<div className="text-3xl font-medium text-[#2d2d2d] flex items-center">
				<div className="mr-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-8 w-8 rounded-md flex items-center justify-center">
					T
				</div>
				Таскер
			</div>

			<div className="flex-1 max-w-xl mx-auto">
				<div className="relative">
					<input
						type="text"
						placeholder="Поиск"
						value={searchQuery}
						onChange={handleSearch}
						className="bg-[#f1f1f5] w-full pl-10 pr-5 py-[9px] rounded-[10px] text-[#929299]"
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#929299]" />
				</div>
			</div>
		</div>
	);
};

export default Header;
