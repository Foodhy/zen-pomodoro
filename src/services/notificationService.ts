
import { toast } from "@/components/ui/use-toast";

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    // Initialize notification permission status
    if ('Notification' in window) {
      this.permission = Notification.permission;
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

  public async showNotification(title: string, options?: NotificationOptions): Promise<boolean> {
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
}

export default NotificationService.getInstance();
