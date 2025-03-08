import React from "react";
import TaskItem from "./TaskItem";

const TaskList: React.FC = () => {
  // Sample data for tasks
  const tasks = [
    {
      id: "4",
      date: "Март",
      result: "Доходность",
      object: "Робот MVP",
      task: "Плановый доход в час",
      status: "inProgress" as const,
      statusLabel: "В работе",
      assignee: "Дима",
      subTasks: [
        {
          object: "Рейтинг",
          description: "Обновить имена таблиц как в мускуле 001 и т.д.",
          status: "take" as const,
          statusLabel: "Взять",
          assignee: "Женя",
        },
        {
          object: "Таскер",
          description:
            "Когда в стейте что то вычитается для получечния 0, то прям записывать 0, иначе флоат оставит 0.00000001",
          status: "take" as const,
          statusLabel: "Взять",
          assignee: "Саша",
        },
      ],
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
    {
      id: "16",
      date: "Март",
      result: "Порядок",
      object: "Внедрить индикаторы",
      task: "Вывод из просадки другими алгоритмами",
      status: "blocked" as const,
      statusLabel: "Блок софта",
      assignee: "Дэ Хан",
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
    {
      id: "13",
      date: "Март",
      result: "Просадка",
      object: "chart_api",
      task: "Создать 10 алгоритмов",
      status: "check" as const,
      statusLabel: "Проверить",
      assignee: "Денис",
    },
  ];

  return (
    <div className="w-full text-xl tracking-[0.12px] mt-10 px-10 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(45,45,45,1)] border flex min-h-20 w-full items-center gap-[40px_60px] text-white font-medium whitespace-nowrap flex-wrap px-5 py-[29px] rounded-[10px] border-white border-solid max-md:max-w-full">
        <div className="self-stretch w-[100px] my-auto">ID</div>
        <div className="self-stretch w-[100px] my-auto">Дата</div>
        <div className="self-stretch w-[120px] my-auto">Результат</div>
        <div className="self-stretch w-[210px] my-auto">Объект</div>
        <div className="self-stretch flex min-w-60 flex-col justify-center w-[400px] my-auto">
          <div className="self-stretch w-[210px] max-w-full gap-2.5">
            Задача
          </div>
        </div>
        <div className="self-stretch flex items-center my-auto">
          <div className="self-stretch w-[150px] my-auto">Статус</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b4ef5065272abb765e3c43e6df840dad3659f8afb38d9131bbb73d13351a388?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-3.5 stroke-[1.5px] stroke-white self-stretch shrink-0 my-auto"
            alt=""
          />
        </div>
        <div className="self-stretch w-[130px] my-auto">Исполнитель</div>
      </div>
      <div className="w-full text-[rgba(105,105,116,1)] font-normal mt-5 max-md:max-w-full">
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            id={task.id}
            date={task.date}
            result={task.result}
            object={task.object}
            task={task.task}
            status={task.status}
            statusLabel={task.statusLabel}
            assignee={task.assignee}
            subTasks={task.subTasks}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
