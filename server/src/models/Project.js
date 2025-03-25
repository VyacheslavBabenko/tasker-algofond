import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Project = sequelize.define(
	"Project",
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		tasksCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		tableName: "projects",
		timestamps: true,
	}
);

export default Project;
