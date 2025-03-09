
import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { useTask } from "@/contexts/TaskContext";
import { Filter, Plus } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FieldType = "text" | "number" | "list";

interface Field {
  id: string;
  name: string;
  type: FieldType;
  options?: Array<{ id: string; value: string; color: string }>;
}

const DEFAULT_FIELDS: Field[] = [
  { id: "id", name: "ID", type: "text" },
  { id: "date", name: "Дата", type: "text" },
  { id: "result", name: "Результат", type: "text" },
  { id: "object", name: "Объект", type: "text" },
  { id: "task", name: "Задача", type: "text" },
  { id: "status", name: "Статус", type: "list", options: [
    { id: "inProgress", value: "В работе", color: "#cffeb0" },
    { id: "take", value: "Взять", color: "#ffd0d0" },
    { id: "check", value: "Проверить", color: "#868686" },
    { id: "blocked", value: "Блок софта", color: "#ff3838" }
  ]},
  { id: "assignee", name: "Исполнитель", type: "text" }
];

interface TaskListProps {
  boardId: string;
}

const TaskList: React.FC<TaskListProps> = ({ boardId }) => {
  const { filteredTasks, updateTask, updateSubTask } = useTask();
  const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<{ name: string; type: FieldType }>({ name: "", type: "text" });
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({});

  const handleStatusChange = (id: string, status: "inProgress" | "take" | "check" | "blocked") => {
    let statusLabel = "";
    switch (status) {
      case "inProgress":
        statusLabel = "В работе";
        break;
      case "take":
        statusLabel = "Взять";
        break;
      case "check":
        statusLabel = "Проверить";
        break;
      case "blocked":
        statusLabel = "Блок софта";
        break;
    }
    
    updateTask(id, { status, statusLabel });
  };

  const handleSubTaskStatusChange = (
    taskId: string, 
    subTaskId: string, 
    status: "inProgress" | "take" | "check" | "blocked"
  ) => {
    let statusLabel = "";
    switch (status) {
      case "inProgress":
        statusLabel = "В работе";
        break;
      case "take":
        statusLabel = "Взять";
        break;
      case "check":
        statusLabel = "Проверить";
        break;
      case "blocked":
        statusLabel = "Блок софта";
        break;
    }
    
    updateSubTask(taskId, subTaskId, { status, statusLabel });
  };

  const addField = () => {
    if (newField.name.trim()) {
      const newFieldObj: Field = {
        id: `field_${Date.now()}`,
        name: newField.name,
        type: newField.type,
        ...(newField.type === "list" ? { options: [] } : {})
      };
      
      setFields([...fields, newFieldObj]);
      setNewField({ name: "", type: "text" });
      setShowAddField(false);
    }
  };

  const openFieldSettings = (field: Field) => {
    setSelectedField(field);
    setShowFieldSettings(true);
  };

  const updateField = (updatedField: Field) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
    setSelectedField(null);
    setShowFieldSettings(false);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    setSelectedField(null);
    setShowFieldSettings(false);
  };

  const applyFilter = (fieldId: string, value: string) => {
    setFieldFilters({
      ...fieldFilters,
      [fieldId]: value
    });
  };

  const getFilteredTasks = () => {
    return filteredTasks.filter(task => {
      for (const [fieldId, filterValue] of Object.entries(fieldFilters)) {
        if (!filterValue) continue;
        
        const fieldValue = task[fieldId]?.toString().toLowerCase();
        if (fieldValue && !fieldValue.includes(filterValue.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  };

  const finalFilteredTasks = getFilteredTasks();

  return (
    <div className="container max-w-full pb-6">
      <div className="flex justify-end mb-5 px-6 pt-6">
        <Button 
          className="bg-[#1e293b] hover:bg-[#0f172a] text-white gap-2 px-4 py-2 h-auto"
          onClick={() => setShowAddField(true)}
        >
          <Plus className="h-5 w-5" /> Добавить поле
        </Button>
      </div>
      
      <div className="bg-[#2d2d2d] text-white">
        <div className="flex h-[60px] items-center font-medium">
          <div className="w-[60px] flex-shrink-0 flex items-center justify-center text-sm">
            ID <Filter className="h-3 w-3 ml-1 text-gray-400" />
          </div>
          <div className="w-[100px] flex-shrink-0 flex items-center text-sm">
            Дата <Filter className="h-3 w-3 ml-1 text-gray-400" />
          </div>
          <div className="w-[120px] flex-shrink-0 flex items-center text-sm">
            Результат <Filter className="h-3 w-3 ml-1 text-gray-400" />
          </div>
          <div className="w-[120px] flex-shrink-0 flex items-center text-sm">
            Объект <Filter className="h-3 w-3 ml-1 text-gray-400" />
          </div>
          <div className="flex-1 text-sm flex items-center pl-8">
            Задача
          </div>
          <div className="w-[180px] flex-shrink-0 flex items-center text-sm">
            Статус <Filter className="h-3 w-3 ml-1 text-gray-400" />
          </div>
          <div className="w-[120px] flex-shrink-0 flex items-center text-sm">
            Исполнитель <Filter className="h-3 w-3 ml-1 text-gray-400" />
          </div>
          <div className="w-[60px]"></div>
        </div>
      </div>
      
      <div className="bg-white">
        {finalFilteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            onStatusChange={handleStatusChange}
            onSubTaskStatusChange={handleSubTaskStatusChange}
          />
        ))}
      </div>

      <Dialog open={showAddField} onOpenChange={setShowAddField}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить поле</DialogTitle>
            <DialogDescription>Создайте новое поле для вашей доски</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fieldName" className="text-right">Имя</label>
              <Input
                id="fieldName"
                value={newField.name}
                onChange={(e) => setNewField({...newField, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fieldType" className="text-right">Тип</label>
              <select
                id="fieldType"
                value={newField.type}
                onChange={(e) => setNewField({...newField, type: e.target.value as FieldType})}
                className="col-span-3 p-2 border rounded"
              >
                <option value="text">Текстовое</option>
                <option value="number">Числовое</option>
                <option value="list">Список</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddField(false)}>
              Отмена
            </Button>
            <Button type="submit" onClick={addField}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFieldSettings} onOpenChange={setShowFieldSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройка поля</DialogTitle>
          </DialogHeader>
          {selectedField && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="settingsName" className="text-right">Имя</label>
                <Input
                  id="settingsName"
                  value={selectedField.name}
                  onChange={(e) => setSelectedField({...selectedField, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              {selectedField.type === 'list' && (
                <div className="mt-4">
                  <h3 className="mb-2 font-medium">Опции списка</h3>
                  {selectedField.options?.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <Input
                        value={option.value}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options || [])];
                          newOptions[index] = {...option, value: e.target.value};
                          setSelectedField({...selectedField, options: newOptions});
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = (selectedField.options || []).filter(o => o.id !== option.id);
                          setSelectedField({...selectedField, options: newOptions});
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="mt-2"
                    onClick={() => {
                      const newOption = {
                        id: `option_${Date.now()}`,
                        value: 'Новый пункт',
                        color: '#' + Math.floor(Math.random()*16777215).toString(16)
                      };
                      setSelectedField({
                        ...selectedField,
                        options: [...(selectedField.options || []), newOption]
                      });
                    }}
                  >
                    Добавить пункт
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => selectedField && deleteField(selectedField.id)}
            >
              Удалить
            </Button>
            <Button
              type="submit"
              onClick={() => selectedField && updateField(selectedField)}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
