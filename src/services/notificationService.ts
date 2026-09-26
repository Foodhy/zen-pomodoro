
import { toast } from "@/components/ui/use-toast";
import { Task } from "../models/types";
import { t, tf } from "./translationService";

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private notificationSound: HTMLAudioElement | null = null;
  private language: string = 'en';
  private soundSrc = '/notification.mp3';

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

  /** Set the active UI language so notifications match the user's locale. */
  public setLanguage(language: string): void {
    this.language = language;
  }

  public setSound(src: string): void {
    if (this.soundSrc === src && this.notificationSound) return;
    this.soundSrc = src;
    try {
      this.notificationSound = new Audio(src);
    } catch (error) {
      console.warn('Could not load notification sound', error);
    }
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
    const lang = this.language;
    let title = '';
    let body = '';

    if (type === 'work') {
      title = t('notif.work.completed.title', lang);
      body = t('notif.work.completed.body', lang);
    } else if (type === 'shortBreak') {
      title = t('notif.shortBreak.completed.title', lang);
      body = t('notif.shortBreak.completed.body', lang);
    } else {
      title = t('notif.longBreak.completed.title', lang);
      body = t('notif.longBreak.completed.body', lang);
    }

    await this.showNotification(title, { body });
  }

  public async notifyTaskReminder(taskTitle: string): Promise<void> {
    const lang = this.language;
    const title = t('notif.task.reminder.title', lang);
    const body = tf('notif.task.reminder.body', lang, { task: taskTitle });

    await this.showNotification(title, { body });
  }

  public async notifyPhaseStarted(type: 'work' | 'shortBreak' | 'longBreak'): Promise<void> {
    const lang = this.language;
    let title = '';
    let body = '';

    if (type === 'work') {
      title = t('notif.work.started.title', lang);
      body = t('notif.work.started.body', lang);
    } else if (type === 'shortBreak') {
      title = t('notif.shortBreak.started.title', lang);
      body = t('notif.shortBreak.started.body', lang);
    } else {
      title = t('notif.longBreak.started.title', lang);
      body = t('notif.longBreak.started.body', lang);
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
