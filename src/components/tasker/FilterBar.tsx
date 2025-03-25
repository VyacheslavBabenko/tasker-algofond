import React, { useState } from "react";
import {
	ChevronDown,
	Plus,
	List,
	ChevronRight,
	Filter,
	CalendarDays,
	Users,
	ArrowDownUp,
	MoreHorizontal,
} from "lucide-react";
import { useTask } from "@/contexts/TaskContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterButtonProps {
	label: string;
	active?: boolean;
	onClick: () => void;
	width?: string;
	icon?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({
	label,
	active = false,
	onClick,
	width = "w-28",
	icon,
}) => {
	return (
		<button
			className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm ${width} ${
				active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
			}`}
			onClick={onClick}
		>
			{icon}
			<span>{label}</span>
			<ChevronDown className="h-3 w-3 opacity-70" />
		</button>
	);
};

interface FilterBarProps {
	onAddTask?: () => void;
	onAddField?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddTask, onAddField }) => {
	const { activeFilter, setFilter, teamMembers } = useTask();
	const [showAddField, setShowAddField] = useState(false);
	const [showFieldType, setShowFieldType] = useState(false);
	const [newField, setNewField] = useState({ name: "", type: "text" });

	// Фильтры по датам
	const dateFilters = [
		{
			name: "Все даты",
			width: "w-[100px]",
			icon: <CalendarDays className="h-3.5 w-3.5 text-gray-500" />,
		},
		{ name: "Март", width: "w-[80px]" },
		{ name: "Апрель", width: "w-[90px]" },
		{ name: "Май", width: "w-[70px]" },
	];

	// Фильтры по статусам
	const statusFilters = [
		{
			name: "Все статусы",
			width: "w-[120px]",
			icon: <Filter className="h-3.5 w-3.5 text-gray-500" />,
		},
		{ name: "В работе", width: "w-[110px]", value: "inProgress" },
		{ name: "Взять", width: "w-[90px]", value: "take" },
		{ name: "Проверить", width: "w-[110px]", value: "check" },
		{ name: "Блок софта", width: "w-[120px]", value: "blocked" },
	];

	// Опции сортировки
	const sortOptions = [
		{ name: "По умолчанию", value: "default" },
		{ name: "По дате (новые)", value: "date_desc" },
		{ name: "По дате (старые)", value: "date_asc" },
		{ name: "По приоритету", value: "priority" },
		{ name: "По исполнителю", value: "assignee" },
	];

	const [activeSort, setActiveSort] = useState(sortOptions[0]);

	const fieldTypes = [
		{ id: "text", label: "Текст" },
		{ id: "number", label: "Номер" },
		{ id: "date", label: "Дата" },
		{ id: "selector", label: "Селектор" },
	];

	const handleAddField = () => {
		if (onAddField) {
			onAddField();
		}
		setShowAddField(false);
	};

	const handleSelectFieldType = (type: string) => {
		setNewField({ ...newField, type });
		setShowFieldType(false);
	};

	const getFieldTypeLabel = () => {
		const fieldType = fieldTypes.find((type) => type.id === newField.type);
		return fieldType ? fieldType.label : "Текст";
	};

	const resetFilters = () => {
		setFilter("Все");
	};

	return (
		<div className="bg-white shadow-md border-t border-[#e3e3e3]">
			<div className="flex justify-between items-center px-10 py-2">
				<div className="flex items-center gap-2">
					{/* Пользователи */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<Users className="h-3.5 w-3.5 mr-1.5" />
								Исполнители
								<ChevronDown className="h-3 w-3 ml-1.5 opacity-70" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-white rounded-lg shadow-lg p-1">
							<DropdownMenuItem
								className={`py-1.5 px-3 cursor-pointer ${
									activeFilter === "Все" ? "bg-gray-100" : ""
								}`}
								onClick={() => setFilter("Все")}
							>
								Все
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{teamMembers.map((member) => (
								<DropdownMenuItem
									key={member.id}
									className={`py-1.5 px-3 cursor-pointer ${
										activeFilter === member.name ? "bg-gray-100" : ""
									}`}
									onClick={() => setFilter(member.name)}
								>
									{member.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Даты */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<CalendarDays className="h-3.5 w-3.5 mr-1.5" />
								Даты
								<ChevronDown className="h-3 w-3 ml-1.5 opacity-70" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-40 bg-white rounded-lg shadow-lg p-1">
							{dateFilters.map((filter) => (
								<DropdownMenuItem
									key={filter.name}
									className={`py-1.5 px-3 cursor-pointer ${
										activeFilter === filter.name ? "bg-gray-100" : ""
									}`}
									onClick={() => setFilter(filter.name)}
								>
									{filter.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Статусы */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<Filter className="h-3.5 w-3.5 mr-1.5" />
								Статусы
								<ChevronDown className="h-3 w-3 ml-1.5 opacity-70" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-44 bg-white rounded-lg shadow-lg p-1">
							<DropdownMenuItem
								className={`py-1.5 px-3 cursor-pointer ${
									activeFilter === "Все" ? "bg-gray-100" : ""
								}`}
								onClick={() => setFilter("Все")}
							>
								Все статусы
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{statusFilters.slice(1).map((filter) => (
								<DropdownMenuItem
									key={filter.name}
									className={`py-1.5 px-3 cursor-pointer ${
										activeFilter === filter.value ? "bg-gray-100" : ""
									}`}
									onClick={() => setFilter(filter.value || filter.name)}
								>
									{filter.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Сортировка */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<ArrowDownUp className="h-3.5 w-3.5 mr-1.5" />
								{activeSort.name}
								<ChevronDown className="h-3 w-3 ml-1.5 opacity-70" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-44 bg-white rounded-lg shadow-lg p-1">
							{sortOptions.map((option) => (
								<DropdownMenuItem
									key={option.value}
									className={`py-1.5 px-3 cursor-pointer ${
										activeSort.value === option.value ? "bg-gray-100" : ""
									}`}
									onClick={() => setActiveSort(option)}
								>
									{option.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Дополнительные фильтры */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<MoreHorizontal className="h-3.5 w-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-white rounded-lg shadow-lg p-1">
							<DropdownMenuItem onClick={onAddField} className="cursor-pointer">
								<Plus className="h-3.5 w-3.5 mr-2" />
								Добавить поле
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={resetFilters}
							>
								Сбросить фильтры
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								Сохранить текущий вид
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Кнопка добавления задачи */}
				<Button
					onClick={onAddTask}
					size="sm"
					className="h-8 gap-1.5 bg-[#2d2d2d] hover:bg-black text-white"
				>
					<Plus className="h-3.5 w-3.5" />
					Добавить задачу
				</Button>
			</div>

			<Dialog open={showAddField} onOpenChange={setShowAddField}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Название поля</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<Input
							placeholder="Пример 1"
							value={newField.name}
							onChange={(e) =>
								setNewField({ ...newField, name: e.target.value })
							}
							className="bg-gray-100"
						/>
						<div
							className="flex items-center justify-between cursor-pointer"
							onClick={() => setShowFieldType(true)}
						>
							<div>Тип поля: {getFieldTypeLabel()}</div>
							<ChevronRight className="h-4 w-4" />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowAddField(false)}>
							Отмена
						</Button>
						<Button onClick={handleAddField}>Добавить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showFieldType} onOpenChange={setShowFieldType}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Тип поля</DialogTitle>
					</DialogHeader>
					<div className="grid gap-2 py-4">
						{fieldTypes.map((type) => (
							<div
								key={type.id}
								className={`py-3 px-4 rounded-md cursor-pointer ${
									newField.type === type.id
										? "bg-[#2d2d2d] text-white"
										: "bg-gray-100"
								}`}
								onClick={() => handleSelectFieldType(type.id)}
							>
								{type.label}
							</div>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default FilterBar;
