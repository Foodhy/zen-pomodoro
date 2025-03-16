interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

const translations: Translations = {
  // App
  "app.title": {
    en: "Zen Pomodoro",
    es: "Zen Pomodoro",
  },
  
  // Settings
  "settings.title": {
    en: "Settings",
    es: "Configuración",
  },
  "settings.customize": {
    en: "Customize your experience",
    es: "Personaliza tu experiencia",
  },
  "settings.app": {
    en: "App",
    es: "Aplicación",
  },
  "settings.theme": {
    en: "Theme",
    es: "Tema",
  },
  "settings.videos": {
    en: "Videos",
    es: "Videos",
  },
  "settings.history": {
    en: "History",
    es: "Historial",
  },
  "settings.language": {
    en: "Language",
    es: "Idioma",
  },
  "settings.notifications": {
    en: "Notifications",
    es: "Notificaciones",
  },
  "settings.notificationsEnable": {
    en: "Enable notifications",
    es: "Activar notificaciones",
  },
  "settings.soundEnable": {
    en: "Enable sound",
    es: "Activar sonido",
  },
  "settings.display": {
    en: "Display",
    es: "Visualización",
  },
  "settings.splitViewMode": {
    en: "Split view mode",
    es: "Modo vista dividida",
  },
  "settings.keyboard": {
    en: "Keyboard",
    es: "Teclado",
  },
  "settings.keyboardShortcuts": {
    en: "Keyboard shortcuts",
    es: "Atajos de teclado",
  },
  "settings.viewShortcuts": {
    en: "View keyboard shortcuts",
    es: "Ver atajos de teclado",
  },
  "settings.resetStorage": {
    en: "Reset all data",
    es: "Restablecer todos los datos",
  },
  "settings.newThemes": {
    en: "New Themes",
    es: "Nuevos Temas",
  },
  "settings.youtubeVideos": {
    en: "YouTube Videos",
    es: "Videos de YouTube",
  },
  "settings.add": {
    en: "Add",
    es: "Añadir",
  },
  "settings.addVideo": {
    en: "Add Video",
    es: "Añadir Video",
  },
  "settings.titleField": {
    en: "Title",
    es: "Título",
  },
  "settings.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "settings.noVideos": {
    en: "No videos added yet",
    es: "Aún no hay videos añadidos",
  },
  "settings.addYoutube": {
    en: "Add your favorite YouTube videos for focus time",
    es: "Añade tus videos favoritos de YouTube para tiempo de concentración",
  },
  "settings.pomodoroHistory": {
    en: "Pomodoro History",
    es: "Historial de Pomodoro",
  },
  "settings.exportMarkdown": {
    en: "Export to Markdown",
    es: "Exportar a Markdown",
  },
  "settings.noHistory": {
    en: "No pomodoro history yet",
    es: "Aún no hay historial de pomodoro",
  },
  "settings.completePomodoro": {
    en: "Complete pomodoro sessions to see them here",
    es: "Completa sesiones de pomodoro para verlas aquí",
  },
  "settings.duration": {
    en: "Duration",
    es: "Duración",
  },
  "settings.minutes": {
    en: "minutes",
    es: "minutos",
  },
  "settings.toggleTasks": {
    en: "Toggle Tasks Panel",
    es: "Alternar Panel de Tareas",
  },
  "settings.toggleFullscreen": {
    en: "Toggle Fullscreen",
    es: "Alternar Pantalla Completa",
  },
  "settings.toggleFocusMode": {
    en: "Toggle Focus Mode",
    es: "Alternar Modo Concentración",
  },
  "settings.toggleSettings": {
    en: "Toggle Settings",
    es: "Alternar Configuración",
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
    es: "Saltar",
  },
  
  // Tasks
  "tasks.title": {
    en: "Tasks",
    es: "Tareas",
  },
  "tasks.clearCompleted": {
    en: "Clear completed",
    es: "Borrar completadas",
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
  "tasks.newest": {
    en: "Newest first",
    es: "Más reciente primero",
  },
  "tasks.oldest": {
    en: "Oldest first",
    es: "Más antiguo primero",
  },
  "tasks.addNew": {
    en: "Add a new task...",
    es: "Añadir nueva tarea...",
  },
  "tasks.add": {
    en: "Add",
    es: "Añadir",
  },
  "tasks.import": {
    en: "Import",
    es: "Importar",
  },
  "tasks.export": {
    en: "Export",
    es: "Exportar",
  },
  "tasks.noTasks": {
    en: "No tasks yet",
    es: "Aún no hay tareas",
  },
  "tasks.addToStart": {
    en: "Add a task to get started",
    es: "Añade una tarea para comenzar",
  },
  "tasks.completed": {
    en: "Completed",
    es: "Completadas",
  },
  
  // Theme names
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
    es: "Retro NES",
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
    es: "Glasmorfismo",
  },
  "theme.motion": {
    en: "Motion",
    es: "Movimiento",
  },
  "theme.illustration": {
    en: "Illustration",
    es: "Ilustración",
  },
  "theme.miroStyle": {
    en: "Miro Style",
    es: "Estilo Miro",
  },
  
  // Notes
  "notes.title": {
    en: "Notes & Planning",
    es: "Notas & Planificación",
  },
  "notes.export": {
    en: "Export",
    es: "Exportar",
  },
  "notes.import": {
    en: "Import",
    es: "Importar",
  },
  "notes.titlePlaceholder": {
    en: "Note title...",
    es: "Título de la nota...",
  },
  "notes.contentPlaceholder": {
    en: "Write your notes here. Use markdown, code, or plain text...",
    es: "Escribe tus notas aquí. Usa markdown, código o texto plano...",
  },
  "notes.category": {
    en: "Category",
    es: "Categoría",
  },
  "notes.category.technical": {
    en: "Technical",
    es: "Técnica",
  },
  "notes.category.planning": {
    en: "Planning",
    es: "Planificación",
  },
  "notes.category.code": {
    en: "Code",
    es: "Código",
  },
  "notes.category.ideas": {
    en: "Ideas",
    es: "Ideas",
  },
  "notes.category.other": {
    en: "Other",
    es: "Otro",
  },
  "notes.tags": {
    en: "Tags (comma separated)",
    es: "Etiquetas (separadas por comas)",
  },
  "notes.add": {
    en: "Add Note",
    es: "Añadir Nota",
  },
  "notes.save": {
    en: "Save",
    es: "Guardar",
  },
  "notes.update": {
    en: "Update",
    es: "Actualizar",
  },
  "notes.editNote": {
    en: "Edit Note",
    es: "Editar Nota",
  },
  "notes.deleteNote": {
    en: "Delete Note",
    es: "Eliminar Nota",
  },
  "notes.content": {
    en: "Content",
    es: "Contenido",
  },
  "notes.search": {
    en: "Search notes...",
    es: "Buscar notas...",
  },
  "notes.filter": {
    en: "Filter by",
    es: "Filtrar por",
  },
  "notes.filter.all": {
    en: "All Categories",
    es: "Todas las Categorías",
  },
  "notes.noNotes": {
    en: "No notes yet",
    es: "Aún no hay notas",
  },
  "notes.addToStart": {
    en: "Add a note to get started",
    es: "Añade una nota para comenzar",
  },
  "notes.addFirstNote": {
    en: "Add your first note to start planning",
    es: "Agrega tu primera nota para comenzar a planificar",
  }
};

export const t = (key: string, language: string): string => {
  if (!translations[key]) {
    console.warn(`Missing translation for: ${key}`);
    return key;
  }
  
  return translations[key][language as 'en' | 'es'] || translations[key].en;
};
