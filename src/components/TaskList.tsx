
import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Task, TaskPriority } from "../models/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash, FileDown, FileUp, Filter } from "lucide-react";
import TaskItem from "./TaskItem";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportTasksToJson, importTasksFromJson } from "../services/importExportService";
import { t } from "../services/translationService";

interface TaskListProps {
  collapsed?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ collapsed = false }) => {
  const { tasks, saveTask, deleteCompletedTasks, activeProfile, settings, bulkImportTasks } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [sortOption, setSortOption] = useState<string>("createdAt-desc");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTaskTitle.trim() && activeProfile) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        profileId: activeProfile.id,
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveTask(newTask);
      setNewTaskTitle("");
    }
  };

  const handleExportTasks = () => {
    if (activeProfile) {
      const profileTasks = tasks.filter(task => task.profileId === activeProfile.id);
      exportTasksToJson(profileTasks);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportTasks = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeProfile) {
      try {
        const importedTasks = await importTasksFromJson(e.target.files[0]);
        // Update profileId to current profile
        const tasksWithCurrentProfile = importedTasks.map(task => ({
          ...task,
          profileId: activeProfile.id,
          updatedAt: new Date().toISOString()
        }));
        bulkImportTasks(tasksWithCurrentProfile);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error("Error importing tasks:", error);
        // In a real app, you would show a toast notification here
      }
    }
  };

  if (collapsed) {
    return null;
  }

  // Sort tasks based on selected option
  const sortTasks = (tasksToSort: Task[]) => {
    const [field, direction] = sortOption.split('-');
    
    return [...tasksToSort].sort((a, b) => {
      if (field === 'priority') {
        const priorityValues = { 
          [TaskPriority.HIGH]: 3, 
          [TaskPriority.MEDIUM]: 2, 
          [TaskPriority.LOW]: 1 
        };
        
        const aValue = priorityValues[a.priority || TaskPriority.MEDIUM];
        const bValue = priorityValues[b.priority || TaskPriority.MEDIUM];
        
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (field === 'createdAt') {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        
        return direction === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        // Default to title sort if unknown field
        return direction === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      }
    });
  };

  // Filter and sort tasks
  const activeTasks = sortTasks(tasks.filter((task) => !task.completed));
  const completedTasks = sortTasks(tasks.filter((task) => task.completed));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">{t("tasks.title", settings.language)}</h2>

        <div className="flex gap-1 sm:gap-2">
          {/* Show clean completed tasks button */}
          {completedTasks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs hidden md:flex"
              onClick={() => deleteCompletedTasks()}
            >
              <Trash className="h-3.5 w-3.5" />
              {t("tasks.clearCompleted", settings.language)}
            </Button>
          )}
          
          {/* Filter dropdown - moved slightly to the left on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 ml-auto"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption("priority-desc")}>
                {t("tasks.priority", settings.language)}: {t("tasks.priority.high", settings.language)} → {t("tasks.priority.low", settings.language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("priority-asc")}>
                {t("tasks.priority", settings.language)}: {t("tasks.priority.low", settings.language)} → {t("tasks.priority.high", settings.language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("createdAt-desc")}>
                {t("tasks.newest", settings.language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("createdAt-asc")}>
                {t("tasks.oldest", settings.language)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder={t("tasks.addNew", settings.language)}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={newTaskPriority} 
            onValueChange={(value) => setNewTaskPriority(value as TaskPriority)}
          >
            <SelectTrigger className="text-xs flex-1">
              <SelectValue placeholder={t("tasks.priority", settings.language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskPriority.HIGH}>{t("tasks.priority.high", settings.language)}</SelectItem>
              <SelectItem value={TaskPriority.MEDIUM}>{t("tasks.priority.medium", settings.language)}</SelectItem>
              <SelectItem value={TaskPriority.LOW}>{t("tasks.priority.low", settings.language)}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            type="submit"
            size="sm"
            className="h-9"
            disabled={!newTaskTitle.trim()}
          >
            <Plus className="h-5 w-5 mr-1" />
            {t("tasks.add", settings.language)}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="gap-1"
        >
          <FileUp className="h-4 w-4" />
          {t("tasks.import", settings.language)}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportTasks}
          accept=".json"
          style={{ display: 'none' }}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportTasks}
          className="gap-1"
        >
          <FileDown className="h-4 w-4" />
          {t("tasks.export", settings.language)}
        </Button>
      </div>

      {/* Responsive task list container with better scrolling */}
      <div className="flex-1 overflow-y-auto pb-8">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <p className="text-sm">{t("tasks.noTasks", settings.language)}</p>
            <p className="text-xs mt-1">{t("tasks.addToStart", settings.language)}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}

            {completedTasks.length > 0 && (
              <div className="mt-4 pt-2 border-t border-border/30">
                <div className="text-xs font-medium opacity-50 mb-2">
                  {t("tasks.completed", settings.language)}
                </div>
                <div className="space-y-1">
                  {completedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile-only trash button for completed tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/30 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 gap-1 text-xs justify-center"
            onClick={() => deleteCompletedTasks()}
          >
            <Trash className="h-3.5 w-3.5" />
            {t("tasks.clearCompleted", settings.language)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
