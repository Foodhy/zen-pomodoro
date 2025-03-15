
import { toast } from "@/components/ui/use-toast";
import { Task } from "../models/types";

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private notificationSound: HTMLAudioElement | null = null;

  private constructor() {
    // Initialize notification permission status
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    
    // Initialize notification sound
    try {
      this.notificationSound = new Audio('/notification.mp3');
    } catch (error) {
      console.warn('Could not load notification sound', error);
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private playSound(): void {
    try {
      if (this.notificationSound) {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(e => console.warn('Could not play notification sound', e));
      }
    } catch (error) {
      console.warn('Error playing notification sound', error);
    }
  }

  public async showNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    // Play sound regardless of notification permission
    this.playSound();
    
    if (!('Notification' in window)) {
      // Fallback to toast notification
      toast({
        title,
        description: options?.body,
        duration: 5000,
      });
      return false;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        // Fallback to toast notification
        toast({
          title,
          description: options?.body,
          duration: 5000,
        });
        return false;
      }
    }

    try {
      new Notification(title, options);
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      
      // Fallback to toast notification
      toast({
        title,
        description: options?.body,
        duration: 5000,
      });
      return false;
    }
  }

  public async notifyPomodoroCompleted(type: 'work' | 'shortBreak' | 'longBreak'): Promise<void> {
    let title = '';
    let body = '';

    if (type === 'work') {
      title = 'Work session completed!';
      body = 'Time for a break. Stand up and stretch a bit.';
    } else if (type === 'shortBreak') {
      title = 'Break time is over!';
      body = 'Ready to get back to work?';
    } else {
      title = 'Long break completed!';
      body = 'Ready for a new productive session?';
    }

    await this.showNotification(title, { body });
  }

  public async notifyTaskReminder(taskTitle: string): Promise<void> {
    const title = 'Task Reminder';
    const body = `It's time for: ${taskTitle}`;

    await this.showNotification(title, { body });
  }

  public async notifyPhaseStarted(type: 'work' | 'shortBreak' | 'longBreak'): Promise<void> {
    let title = '';
    let body = '';

    if (type === 'work') {
      title = 'Work phase started';
      body = 'Focus on your task. You can do it!';
    } else if (type === 'shortBreak') {
      title = 'Short break started';
      body = 'Take a moment to relax.';
    } else {
      title = 'Long break started';
      body = 'Time for an extended break. Rest well!';
    }

    await this.showNotification(title, { body });
  }

  // Check for tasks that need notifications
  public checkTaskNotifications(tasks: Task[]): void {
    const now = new Date();
    
    tasks.forEach(task => {
      if (task.notifyAt && !task.completed) {
        const notifyDate = new Date(task.notifyAt);
        
        // If the notification time is within the last minute (to account for polling intervals)
        const diffMs = Math.abs(now.getTime() - notifyDate.getTime());
        const diffMinutes = Math.floor(diffMs / 60000);
        
        if (diffMinutes < 1) {
          this.notifyTaskReminder(task.title);
        }
      }
    });
  }
}

export default NotificationService.getInstance();
