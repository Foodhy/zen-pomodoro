
import React, { useState } from 'react';
import { Task } from '../models/types';
import { useApp } from '../context/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarUI } from '@/components/ui/calendar';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { saveTask, deleteTask } = useApp();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handleCheck = (checked: boolean) => {
    saveTask({
      ...task,
      completed: checked
    });
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const notifyAt = date.toISOString();
      saveTask({
        ...task,
        notifyAt
      });
    } else {
      saveTask({
        ...task,
        notifyAt: undefined
      });
    }
    setIsCalendarOpen(false);
  };
  
  // Parse notifyAt date if it exists
  const notifyDate = task.notifyAt ? new Date(task.notifyAt) : undefined;
  
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-200 
      ${task.completed ? 'bg-secondary/50' : 'hover:bg-secondary/20'}`}>
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={handleCheck}
          className={task.completed ? 'opacity-70' : ''}
        />
        <span className={`text-sm ${task.completed ? 'line-through opacity-70' : ''}`}>
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {task.notifyAt && (
          <div className="text-xs opacity-70 px-2">
            {format(notifyDate!, 'MMM d')}
          </div>
        )}
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarUI
              mode="single"
              selected={notifyDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
