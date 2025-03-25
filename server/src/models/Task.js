import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define(
	"Task",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		date: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		result: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		object: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		task: {
			type: DataTypes.STRING,
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
		order: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		projectId: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "project-1", // По умолчанию будет использоваться основной проект
		},
	},
	{
		tableName: "tasks",
		timestamps: true,
	}
);

export default Task;
