import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: "postgres",
	logging: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

export default sequelize;
