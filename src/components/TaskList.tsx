import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Task } from "../models/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash } from "lucide-react";
import TaskItem from "./TaskItem";

interface TaskListProps {
  collapsed?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ collapsed = false }) => {
  const { tasks, saveTask, deleteCompletedTasks, activeProfile } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTaskTitle.trim() && activeProfile) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        profileId: activeProfile.id,
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveTask(newTask);
      setNewTaskTitle("");
    }
  };

  if (collapsed) {
    return null;
  }

  // Filter tasks that are not completed
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Tasks</h2>

        {completedTasks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => deleteCompletedTasks()}
          >
            <Trash className="h-3.5 w-3.5" />
            Clear Completed
          </Button>
        )}
      </div>

      <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Add a new task... and press enter"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="text-sm"
        />
        {/* <Button
          type="submit"
          size="sm"
          className="h-9 w-9 p-0"
          disabled={!newTaskTitle.trim()}
        >
          <Plus className="h-5 w-5" />
        </Button> */}
      </form>

      <div className="flex-1 overflow-y-auto">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs mt-1">Add a task to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}

            {completedTasks.length > 0 && (
              <div className="mt-4 pt-2 border-t border-border/30">
                <div className="text-xs font-medium opacity-50 mb-2">
                  Completed
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
    </div>
  );
};

export default TaskList;
