import React, { useState } from "react";
import { ChevronDown, Plus, List, ChevronRight } from "lucide-react";
import { useTask } from "@/contexts/TaskContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
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
}

const FilterButton: React.FC<FilterButtonProps> = ({
	label,
	active = false,
	onClick,
	width = "w-28",
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

interface FilterBarProps {
	onAddTask?: () => void;
	onAddField?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddTask, onAddField }) => {
	const { activeFilter, setFilter } = useTask();
	const [showAddField, setShowAddField] = useState(false);
	const [showFieldType, setShowFieldType] = useState(false);
	const [newField, setNewField] = useState({ name: "", type: "text" });

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
		{ name: "Илья", width: "w-[109px]" },
	];

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

	return (
		<div className="flex w-full shadow-md">
			<div className="bg-white flex items-center gap-2.5 p-4 border-t border-r border-[#e3e3e3]">
				<button
					className="bg-[#f1f1f5] p-3 rounded-[10px]"
					onClick={onAddField}
					title="Добавить поле"
				>
					<Plus className="h-3.5 w-3.5" />
				</button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="p-3 rounded-[10px]" title="Показать список имен">
							<List className="h-4 w-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56 bg-white rounded-lg shadow-lg p-2">
						<div
							className="py-2 px-4 bg-gray-100 rounded-md mb-2 flex items-center justify-between cursor-pointer"
							onClick={() => setFilter("Все")}
						>
							<div className="font-medium">Все</div>
							<ChevronRight className="h-4 w-4" />
						</div>
						<div className="space-y-1">
							{filters.slice(1).map((filter) => (
								<div
									key={filter.name}
									className={`py-2 px-4 hover:bg-gray-100 rounded-md cursor-pointer ${
										activeFilter === filter.name ? "bg-gray-100" : ""
									}`}
									onClick={() => setFilter(filter.name)}
								>
									{filter.name}
								</div>
							))}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
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
