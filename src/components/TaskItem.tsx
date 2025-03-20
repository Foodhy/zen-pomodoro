
import React, { useState } from 'react';
import { Task, TaskPriority } from '../models/types';
import { useApp } from '../context/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Edit, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, set } from 'date-fns';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { TimePickerDemo } from './TimePicker';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { saveTask, deleteTask, settings } = useApp();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority || TaskPriority.MEDIUM);
  
  const handleCheck = (checked: boolean) => {
    saveTask({
      ...task,
      completed: checked
    });
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  const handleEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority || TaskPriority.MEDIUM);
    setIsEditing(true);
  };
  
  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      saveTask({
        ...task,
        title: editTitle.trim(),
        priority: editPriority
      });
      setIsEditing(false);
    }
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
  
  // Get priority letter indicator
  const getPriorityLetter = (priority: TaskPriority | undefined) => {
    switch(priority) {
      case TaskPriority.HIGH:
        return 'H';
      case TaskPriority.MEDIUM:
        return 'M';
      case TaskPriority.LOW:
        return 'L';
      default:
        return 'M';
    }
  };
  
  // Get priority color for the badge
  const getPriorityColor = (priority: TaskPriority | undefined) => {
    switch(priority) {
      case TaskPriority.HIGH:
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30';
      case TaskPriority.LOW:
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30';
    }
  };
  
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-200 
      ${task.completed ? 'bg-secondary/50' : 'hover:bg-secondary/20'}`}>
      {isEditing ? (
        // Editing mode
        <div className="flex items-center space-x-2 flex-1">
          <Input 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 text-sm h-8"
            autoFocus
          />
          <Select 
            value={editPriority} 
            onValueChange={(value) => setEditPriority(value as TaskPriority)}
          >
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
              <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={handleSaveEdit}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Display mode
        <div className="flex items-center space-x-3 flex-1">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleCheck}
            className={task.completed ? 'opacity-70' : ''}
          />
          <span className={`text-sm ${task.completed ? 'line-through opacity-70' : ''}`}>
            {task.title}
          </span>
          <Badge variant="outline" className={`ml-2 h-5 px-1.5 py-0 text-[10px] font-semibold ${getPriorityColor(task.priority)}`}>
            {getPriorityLetter(task.priority)}
          </Badge>
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        {task.notifyAt && !isEditing && (
          <div className="text-xs opacity-70 px-2 flex items-center gap-1">
            <span>{format(notifyDate!, 'MMM d')}</span>
            {task.notifyTime && <span>{task.notifyTime}</span>}
          </div>
        )}
        
        {!isEditing && (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            
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
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
