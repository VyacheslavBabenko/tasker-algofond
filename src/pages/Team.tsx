import React, { useState } from "react";
import { useTask } from "@/contexts/TaskContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash, Mail, UserRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TeamMember } from "@/contexts/TaskContext";

const Team = () => {
	const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } =
		useTask();
	const { toast } = useToast();

	const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
	const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({
		name: "",
		role: "",
		email: "",
	});
	const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

	const filteredMembers = teamMembers.filter(
		(member) =>
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(member.email &&
				member.email.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const handleAddMember = async () => {
		if (!newMember.name || !newMember.role) {
			toast({
				title: "Ошибка",
				description: "Имя и роль обязательны для заполнения",
				variant: "destructive",
			});
			return;
		}

		try {
			await addTeamMember(newMember);
			setNewMember({ name: "", role: "", email: "" });
			setIsAddMemberOpen(false);
			toast({
				title: "Участник добавлен",
				description: "Новый участник команды успешно добавлен",
			});
		} catch (error) {
			toast({
				title: "Ошибка",
				description: "Не удалось добавить участника команды",
				variant: "destructive",
			});
		}
	};

	const handleUpdateMember = async () => {
		if (!editingMember || !editingMember.name || !editingMember.role) {
			toast({
				title: "Ошибка",
				description: "Имя и роль обязательны для заполнения",
				variant: "destructive",
			});
			return;
		}

		try {
			await updateTeamMember(editingMember.id, editingMember);
			setEditingMember(null);
			setIsEditMemberOpen(false);
			toast({
				title: "Участник обновлен",
				description: "Информация об участнике команды успешно обновлена",
			});
		} catch (error) {
			toast({
				title: "Ошибка",
				description: "Не удалось обновить информацию об участнике команды",
				variant: "destructive",
			});
		}
	};

	const handleDeleteMember = async (id: string) => {
		if (
			window.confirm("Вы уверены, что хотите удалить этого участника команды?")
		) {
			try {
				await deleteTeamMember(id);
				toast({
					title: "Участник удален",
					description: "Участник команды успешно удален",
				});
			} catch (error) {
				toast({
					title: "Ошибка",
					description: "Не удалось удалить участника команды",
					variant: "destructive",
				});
			}
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Команда</h1>
				<Button onClick={() => setIsAddMemberOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Добавить участника
				</Button>
			</div>

			<div className="mb-6">
				<Input
					placeholder="Поиск по имени, роли или email..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredMembers.map((member) => (
					<Card key={member.id} className="overflow-hidden">
						<CardHeader className="pb-2">
							<div className="flex justify-between">
								<div className="flex items-center">
									<Avatar className="h-10 w-10 mr-4">
										<AvatarImage src={member.avatar} />
										<AvatarFallback>{getInitials(member.name)}</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle>{member.name}</CardTitle>
										<CardDescription>{member.role}</CardDescription>
									</div>
								</div>
								<div className="flex space-x-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											setEditingMember(member);
											setIsEditMemberOpen(true);
										}}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteMember(member.id)}
									>
										<Trash className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{member.email && (
								<div className="flex items-center text-sm text-gray-500 mt-2">
									<Mail className="h-4 w-4 mr-2" />
									<span>{member.email}</span>
								</div>
							)}
						</CardContent>
						<CardFooter className="border-t pt-4 pb-3">
							<div className="text-xs text-gray-500">
								Участвует в {Math.floor(Math.random() * 10) + 1} задачах
							</div>
						</CardFooter>
					</Card>
				))}
			</div>

			{filteredMembers.length === 0 && (
				<div className="text-center py-12">
					<UserRound className="h-12 w-12 mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium mb-2">Участники не найдены</h3>
					<p className="text-gray-500">
						{searchQuery
							? "Попробуйте изменить параметры поиска"
							: "Добавьте первого участника команды"}
					</p>
				</div>
			)}

			{/* Диалог добавления нового участника */}
			<Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Добавить участника команды</DialogTitle>
						<DialogDescription>
							Заполните информацию о новом участнике команды
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Имя*
							</Label>
							<Input
								id="name"
								value={newMember.name}
								onChange={(e) =>
									setNewMember({ ...newMember, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="role" className="text-right">
								Роль*
							</Label>
							<Input
								id="role"
								value={newMember.role}
								onChange={(e) =>
									setNewMember({ ...newMember, role: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={newMember.email || ""}
								onChange={(e) =>
									setNewMember({ ...newMember, email: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
							Отмена
						</Button>
						<Button onClick={handleAddMember}>Добавить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Диалог редактирования участника */}
			<Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Редактировать участника команды</DialogTitle>
						<DialogDescription>
							Обновите информацию об участнике команды
						</DialogDescription>
					</DialogHeader>
					{editingMember && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit-name" className="text-right">
									Имя*
								</Label>
								<Input
									id="edit-name"
									value={editingMember.name}
									onChange={(e) =>
										setEditingMember({ ...editingMember, name: e.target.value })
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit-role" className="text-right">
									Роль*
								</Label>
								<Input
									id="edit-role"
									value={editingMember.role}
									onChange={(e) =>
										setEditingMember({ ...editingMember, role: e.target.value })
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="edit-email" className="text-right">
									Email
								</Label>
								<Input
									id="edit-email"
									type="email"
									value={editingMember.email || ""}
									onChange={(e) =>
										setEditingMember({
											...editingMember,
											email: e.target.value,
										})
									}
									className="col-span-3"
								/>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditMemberOpen(false)}
						>
							Отмена
						</Button>
						<Button onClick={handleUpdateMember}>Сохранить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Team;
