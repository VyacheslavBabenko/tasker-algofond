import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());

// Маршруты
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

// Проверка здоровья сервера
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", message: "Server is running" });
});

// Обработка ошибок
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		error: true,
		message: "Внутренняя ошибка сервера",
		details: process.env.NODE_ENV === "development" ? err.message : undefined,
	});
});

// Запуск сервера
const startServer = async () => {
	try {
		await sequelize.authenticate();
		console.log("Подключение к базе данных успешно установлено.");

		// Синхронизация моделей с базой данных в режиме разработки
		if (process.env.NODE_ENV !== "production") {
			await sequelize.sync({ alter: true });
			console.log("Модели синхронизированы с базой данных");
		}

		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`);
		});
	} catch (error) {
		console.error("Невозможно подключиться к базе данных:", error);
		process.exit(1);
	}
};

startServer();
