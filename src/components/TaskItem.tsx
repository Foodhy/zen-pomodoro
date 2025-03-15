import React, { useState } from 'react';
import { Task } from '../models/types';
import { useApp } from '../context/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, set } from 'date-fns';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { TimePickerDemo } from './TimePicker';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { saveTask, deleteTask } = useApp();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  
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
      // Keep the time if it exists
      let notifyAt = date.toISOString();
      if (task.notifyTime) {
        const [hours, minutes] = task.notifyTime.split(':').map(Number);
        const newDate = set(date, { hours, minutes, seconds: 0 });
        notifyAt = newDate.toISOString();
      }
      
      saveTask({
        ...task,
        notifyAt
      });
    } else {
      saveTask({
        ...task,
        notifyAt: undefined,
        notifyTime: undefined
      });
    }
    setIsCalendarOpen(false);
  };
  
  const handleTimeSelect = (time: string) => {
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      
      // If we have a date, update the time component
      if (task.notifyAt) {
        const currentDate = new Date(task.notifyAt);
        const newDate = set(currentDate, { hours, minutes, seconds: 0 });
        
        saveTask({
          ...task,
          notifyAt: newDate.toISOString(),
          notifyTime: time
        });
      } else {
        // If no date is set, set today's date with this time
        const today = new Date();
        const newDate = set(today, { hours, minutes, seconds: 0 });
        
        saveTask({
          ...task,
          notifyAt: newDate.toISOString(),
          notifyTime: time
        });
      }
    } else {
      // If time is cleared but date exists, keep date only
      if (task.notifyAt) {
        const currentDate = new Date(task.notifyAt);
        const dateOnly = set(currentDate, { hours: 0, minutes: 0, seconds: 0 });
        
        saveTask({
          ...task,
          notifyAt: dateOnly.toISOString(),
          notifyTime: undefined
        });
      }
    }
    setIsTimePickerOpen(false);
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
          <div className="text-xs opacity-70 px-2 flex items-center gap-1">
            <span>{format(notifyDate!, 'MMM d')}</span>
            {task.notifyTime && <span>{task.notifyTime}</span>}
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
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Clock className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <TimePickerDemo 
              value={task.notifyTime || ""}
              onChange={handleTimeSelect}
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
