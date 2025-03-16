
import { LanguageOption } from "../models/types";

// Dictionary for translations
type TranslationDictionary = {
  [key: string]: {
    [key in LanguageOption]: string;
  };
};

export const translations: TranslationDictionary = {
  // General
  "app.title": {
    en: "Zen-Pomodoro",
    es: "Zen-Pomodoro",
  },
  
  // Timer
  "timer.work": {
    en: "Work",
    es: "Trabajo",
  },
  "timer.shortBreak": {
    en: "Short Break",
    es: "Descanso Corto",
  },
  "timer.longBreak": {
    en: "Long Break",
    es: "Descanso Largo",
  },
  "timer.start": {
    en: "Start",
    es: "Iniciar",
  },
  "timer.pause": {
    en: "Pause",
    es: "Pausar",
  },
  "timer.reset": {
    en: "Reset",
    es: "Reiniciar",
  },
  "timer.skip": {
    en: "Skip",
    es: "Omitir",
  },
  
  // Tasks
  "tasks.title": {
    en: "Tasks",
    es: "Tareas",
  },
  "tasks.addNew": {
    en: "Add a new task... and press enter",
    es: "Agregar una nueva tarea... y presiona enter",
  },
  "tasks.noTasks": {
    en: "No tasks yet",
    es: "No hay tareas todavía",
  },
  "tasks.addToStart": {
    en: "Add a task to get started",
    es: "Agrega una tarea para comenzar",
  },
  "tasks.completed": {
    en: "Completed",
    es: "Completadas",
  },
  "tasks.clearCompleted": {
    en: "Clear Completed",
    es: "Borrar Completadas",
  },
  "tasks.priority": {
    en: "Priority",
    es: "Prioridad",
  },
  "tasks.priority.high": {
    en: "High",
    es: "Alta",
  },
  "tasks.priority.medium": {
    en: "Medium",
    es: "Media",
  },
  "tasks.priority.low": {
    en: "Low",
    es: "Baja",
  },
  "tasks.export": {
    en: "Export Tasks",
    es: "Exportar Tareas",
  },
  "tasks.import": {
    en: "Import Tasks",
    es: "Importar Tareas",
  },
  
  // Settings
  "settings.title": {
    en: "Settings",
    es: "Configuración",
  },
  "settings.theme": {
    en: "Theme",
    es: "Tema",
  },
  "settings.language": {
    en: "Language",
    es: "Idioma",
  },
  "settings.shortcuts": {
    en: "Keyboard Shortcuts",
    es: "Atajos de Teclado",
  },
  "settings.notifications": {
    en: "Enable Notifications",
    es: "Habilitar Notificaciones",
  },
  "settings.sound": {
    en: "Enable Sound",
    es: "Habilitar Sonido",
  },
  "settings.splitView": {
    en: "Split View Mode",
    es: "Modo Vista Dividida",
  },
  "settings.focusMode": {
    en: "Focus Mode",
    es: "Modo Enfoque",
  },
  "settings.reset": {
    en: "Reset Local Storage",
    es: "Reiniciar Almacenamiento Local",
  },
  
  // Themes
  "theme.purpleSpace": {
    en: "Purple Space",
    es: "Espacio Púrpura",
  },
  "theme.darkBlue": {
    en: "Dark Blue",
    es: "Azul Oscuro",
  },
  "theme.darkMode": {
    en: "Dark Mode",
    es: "Modo Oscuro",
  },
  "theme.nesRetro": {
    en: "NES Retro",
    es: "NES Retro",
  },
  "theme.netflix": {
    en: "Netflix",
    es: "Netflix",
  },
  "theme.isomorphic": {
    en: "Isomorphic",
    es: "Isomórfico",
  },
  "theme.minimalist": {
    en: "Minimalist",
    es: "Minimalista",
  },
  "theme.skeuomorphism": {
    en: "Skeuomorphism",
    es: "Skeuomorfismo",
  },
  "theme.flatDesign": {
    en: "Flat Design",
    es: "Diseño Plano",
  },
  "theme.bauhaus": {
    en: "Bauhaus",
    es: "Bauhaus",
  },
  "theme.neumorphism": {
    en: "Neumorphism",
    es: "Neumorfismo",
  },
  "theme.glassmorphism": {
    en: "Glassmorphism",
    es: "Glassmorfismo",
  },
  "theme.motion": {
    en: "Motion",
    es: "Movimiento",
  },
  "theme.illustration": {
    en: "Illustration",
    es: "Ilustración",
  },
};

// Translation helper function
export const t = (key: string, language: LanguageOption = "en"): string => {
  if (translations[key] && translations[key][language]) {
    return translations[key][language];
  }
  // Fallback to English if translation not found
  if (translations[key] && translations[key]["en"]) {
    return translations[key]["en"];
  }
  // Return the key if no translation found
  return key;
};
