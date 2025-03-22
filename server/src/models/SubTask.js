import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Task from "./Task.js";

const SubTask = sequelize.define(
	"SubTask",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		object: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("inProgress", "take", "check", "blocked"),
			allowNull: false,
			defaultValue: "take",
		},
		statusLabel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "Взять",
		},
		assignee: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		taskId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Task,
				key: "id",
			},
		},
	},
	{
		tableName: "subtasks",
		timestamps: true,
	}
);

// Определение связи между Task и SubTask
Task.hasMany(SubTask, {
	foreignKey: "taskId",
	as: "subTasks",
	onDelete: "CASCADE",
});
SubTask.belongsTo(Task, { foreignKey: "taskId" });

export default SubTask;
