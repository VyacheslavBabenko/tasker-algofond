
import React, { createContext, useContext, useState, ReactNode } from "react";

type StatusType = "inProgress" | "take" | "check" | "blocked";

export interface SubTask {
  id: string;
  object: string;
  description: string;
  status: StatusType;
  statusLabel: string;
  assignee: string;
}

export interface Task {
  id: string;
  date: string;
  result: string;
  object: string;
  task: string;
  status: StatusType;
  statusLabel: string;
  assignee: string;
  subTasks?: SubTask[];
}

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  activeFilter: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setFilter: (filter: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  updateSubTask: (taskId: string, subTaskId: string, updatedSubTask: Partial<SubTask>) => void;
  deleteTask: (id: string) => void;
}

const initialTasks: Task[] = [
  {
    id: "4",
    date: "Март",
    result: "Доходность",
    object: "Робот MVP",
    task: "Плановый доход в час",
    status: "inProgress",
    statusLabel: "В работе",
    assignee: "Дима",
    subTasks: [
      {
        id: "s1",
        object: "Рейтинг",
        description: "Обновить имена таблиц как в мускуле 001 и т.д.",
        status: "take",
        statusLabel: "Взять",
        assignee: "Женя",
      },
      {
        id: "s2",
        object: "Таскер",
        description:
          "Когда в стейте что то вычитается для получечния 0, то прям записывать 0, иначе флоат оставит 0.00000001",
        status: "take",
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
    status: "check",
    statusLabel: "Проверить",
    assignee: "Денис",
  },
  {
    id: "16",
    date: "Март",
    result: "Порядок",
    object: "Внедрить индикаторы",
    task: "Вывод из просадки другими алгоритмами",
    status: "blocked",
    statusLabel: "Блок софта",
    assignee: "Дэ Хан",
  },
  {
    id: "23",
    date: "Март",
    result: "Просадка",
    object: "chart_api",
    task: "Создать 10 алгоритмов",
    status: "check",
    statusLabel: "Проверить",
    assignee: "Денис",
  },
  {
    id: "33",
    date: "Март",
    result: "Просадка",
    object: "chart_api",
    task: "Создать 10 алгоритмов",
    status: "check",
    statusLabel: "Проверить",
    assignee: "Денис",
  },
  {
    id: "43",
    date: "Март",
    result: "Просадка",
    object: "chart_api",
    task: "Создать 10 алгоритмов",
    status: "check",
    statusLabel: "Проверить",
    assignee: "Денис",
  },
  {
    id: "53",
    date: "Март",
    result: "Просадка",
    object: "chart_api",
    task: "Создать 10 алгоритмов",
    status: "check",
    statusLabel: "Проверить",
    assignee: "Денис",
  },
  {
    id: "63",
    date: "Март",
    result: "Просадка",
    object: "chart_api",
    task: "Создать 10 алгоритмов",
    status: "check",
    statusLabel: "Проверить",
    assignee: "Денис",
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeFilter, setActiveFilter] = useState<string>("Все");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredTasks = tasks.filter((task) => {
    // Apply search filter
    const matchesSearch = 
      searchTerm === "" || 
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Apply category filter
    if (activeFilter === "Все") return true;
    if (activeFilter === task.date) return true;
    if (activeFilter === task.assignee) return true;
    
    // Check subtasks
    if (task.subTasks) {
      return task.subTasks.some(subTask => subTask.assignee === activeFilter);
    }
    
    return false;
  });

  const setFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const updateSubTask = (taskId: string, subTaskId: string, updatedSubTask: Partial<SubTask>) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId && task.subTasks) {
          return {
            ...task,
            subTasks: task.subTasks.map((subTask) => 
              subTask.id === subTaskId ? { ...subTask, ...updatedSubTask } : subTask
            ),
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        activeFilter,
        searchTerm,
        setSearchTerm,
        setFilter,
        addTask,
        updateTask,
        updateSubTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
