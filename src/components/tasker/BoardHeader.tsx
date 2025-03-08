
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

interface BoardHeaderProps {
  activeBoard: { id: string; name: string };
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  showSettings: boolean;
  onCloseSettings: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ 
  activeBoard, 
  onRename, 
  onDelete,
  showSettings,
  onCloseSettings
}) => {
  const [newName, setNewName] = useState(activeBoard.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRename = () => {
    onRename(activeBoard.id, newName);
    onCloseSettings();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(activeBoard.id);
    setShowDeleteConfirm(false);
    onCloseSettings();
  };

  return (
    <>
      <Dialog open={showSettings} onOpenChange={onCloseSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Настройки доски</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Имя
              </label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
            <Button type="submit" onClick={handleRename}>
              Переименовать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы действительно хотите удалить доску?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие невозможно отменить. Доска будет навсегда удалена.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BoardHeader;
