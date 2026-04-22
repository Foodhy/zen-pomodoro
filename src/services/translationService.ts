interface Translations {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
    nl: string;
  };
}

const translations: Translations = {
  // App
  "app.title": { en: "Zen Pomodoro", es: "Zen Pomodoro", fr: "Zen Pomodoro", nl: "Zen Pomodoro" },

  // Settings
  "settings.title": { en: "Settings", es: "Configuración", fr: "Paramètres", nl: "Instellingen" },
  "settings.customize": { en: "Customize your experience", es: "Personaliza tu experiencia", fr: "Personnalisez votre expérience", nl: "Pas je ervaring aan" },
  "settings.app": { en: "App", es: "Aplicación", fr: "Application", nl: "App" },
  "settings.theme": { en: "Theme", es: "Tema", fr: "Thème", nl: "Thema" },
  "settings.videos": { en: "Videos", es: "Videos", fr: "Vidéos", nl: "Video's" },
  "settings.history": { en: "History", es: "Historial", fr: "Historique", nl: "Geschiedenis" },
  "settings.language": { en: "Language", es: "Idioma", fr: "Langue", nl: "Taal" },
  "settings.notifications": { en: "Notifications", es: "Notificaciones", fr: "Notifications", nl: "Meldingen" },
  "settings.notificationsEnable": { en: "Enable notifications", es: "Activar notificaciones", fr: "Activer les notifications", nl: "Meldingen inschakelen" },
  "settings.soundEnable": { en: "Enable sound", es: "Activar sonido", fr: "Activer le son", nl: "Geluid inschakelen" },
  "settings.display": { en: "Display", es: "Visualización", fr: "Affichage", nl: "Weergave" },
  "settings.splitViewMode": { en: "Split view mode", es: "Modo vista dividida", fr: "Mode vue divisée", nl: "Gesplitste weergave" },
  "settings.keyboard": { en: "Keyboard", es: "Teclado", fr: "Clavier", nl: "Toetsenbord" },
  "settings.keyboardShortcuts": { en: "Keyboard shortcuts", es: "Atajos de teclado", fr: "Raccourcis clavier", nl: "Sneltoetsen" },
  "settings.viewShortcuts": { en: "View keyboard shortcuts", es: "Ver atajos de teclado", fr: "Voir les raccourcis", nl: "Bekijk sneltoetsen" },
  "settings.resetStorage": { en: "Reset all data", es: "Restablecer todos los datos", fr: "Réinitialiser toutes les données", nl: "Alle gegevens resetten" },
  "settings.newThemes": { en: "New Themes", es: "Nuevos Temas", fr: "Nouveaux Thèmes", nl: "Nieuwe thema's" },
  "settings.youtubeVideos": { en: "YouTube Videos", es: "Videos de YouTube", fr: "Vidéos YouTube", nl: "YouTube-video's" },
  "settings.add": { en: "Add", es: "Añadir", fr: "Ajouter", nl: "Toevoegen" },
  "settings.addVideo": { en: "Add Video", es: "Añadir Video", fr: "Ajouter une vidéo", nl: "Video toevoegen" },
  "settings.titleField": { en: "Title", es: "Título", fr: "Titre", nl: "Titel" },
  "settings.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", nl: "Annuleren" },
  "settings.noVideos": { en: "No videos added yet", es: "Aún no hay videos añadidos", fr: "Aucune vidéo ajoutée", nl: "Nog geen video's toegevoegd" },
  "settings.addYoutube": { en: "Add your favorite YouTube videos for focus time", es: "Añade tus videos favoritos de YouTube para tiempo de concentración", fr: "Ajoutez vos vidéos YouTube préférées pour la concentration", nl: "Voeg je favoriete YouTube-video's toe voor focustijd" },
  "settings.pomodoroHistory": { en: "Pomodoro History", es: "Historial de Pomodoro", fr: "Historique Pomodoro", nl: "Pomodoro-geschiedenis" },
  "settings.exportMarkdown": { en: "Export to Markdown", es: "Exportar a Markdown", fr: "Exporter en Markdown", nl: "Exporteren naar Markdown" },
  "settings.noHistory": { en: "No pomodoro history yet", es: "Aún no hay historial de pomodoro", fr: "Aucun historique pomodoro", nl: "Nog geen pomodoro-geschiedenis" },
  "settings.completePomodoro": { en: "Complete pomodoro sessions to see them here", es: "Completa sesiones de pomodoro para verlas aquí", fr: "Terminez des sessions pour les voir ici", nl: "Voltooi sessies om ze hier te zien" },
  "settings.duration": { en: "Duration", es: "Duración", fr: "Durée", nl: "Duur" },
  "settings.minutes": { en: "minutes", es: "minutos", fr: "minutes", nl: "minuten" },
  "settings.toggleTasks": { en: "Toggle Tasks Panel", es: "Alternar Panel de Tareas", fr: "Basculer le panneau de tâches", nl: "Takenpaneel schakelen" },
  "settings.toggleFullscreen": { en: "Toggle Fullscreen", es: "Alternar Pantalla Completa", fr: "Basculer le plein écran", nl: "Volledig scherm schakelen" },
  "settings.toggleFocusMode": { en: "Toggle Focus Mode", es: "Alternar Modo Concentración", fr: "Basculer le mode focus", nl: "Focusmodus schakelen" },
  "settings.toggleSettings": { en: "Toggle Settings", es: "Alternar Configuración", fr: "Basculer les paramètres", nl: "Instellingen schakelen" },

  // Timer
  "timer.work": { en: "Work", es: "Trabajo", fr: "Travail", nl: "Werk" },
  "timer.shortBreak": { en: "Short Break", es: "Descanso Corto", fr: "Petite pause", nl: "Korte pauze" },
  "timer.longBreak": { en: "Long Break", es: "Descanso Largo", fr: "Longue pause", nl: "Lange pauze" },
  "timer.start": { en: "Start", es: "Iniciar", fr: "Démarrer", nl: "Start" },
  "timer.pause": { en: "Pause", es: "Pausar", fr: "Pause", nl: "Pauze" },
  "timer.reset": { en: "Reset", es: "Reiniciar", fr: "Réinitialiser", nl: "Reset" },
  "timer.skip": { en: "Skip", es: "Saltar", fr: "Passer", nl: "Overslaan" },

  // Tasks
  "tasks.title": { en: "Tasks", es: "Tareas", fr: "Tâches", nl: "Taken" },
  "tasks.clearCompleted": { en: "Clear completed", es: "Borrar completadas", fr: "Effacer terminées", nl: "Voltooide wissen" },
  "tasks.priority": { en: "Priority", es: "Prioridad", fr: "Priorité", nl: "Prioriteit" },
  "tasks.priority.high": { en: "High", es: "Alta", fr: "Haute", nl: "Hoog" },
  "tasks.priority.medium": { en: "Medium", es: "Media", fr: "Moyenne", nl: "Gemiddeld" },
  "tasks.priority.low": { en: "Low", es: "Baja", fr: "Basse", nl: "Laag" },
  "tasks.newest": { en: "Newest first", es: "Más reciente primero", fr: "Plus récent d'abord", nl: "Nieuwste eerst" },
  "tasks.oldest": { en: "Oldest first", es: "Más antiguo primero", fr: "Plus ancien d'abord", nl: "Oudste eerst" },
  "tasks.addNew": { en: "Add a new task...", es: "Añadir nueva tarea...", fr: "Ajouter une tâche...", nl: "Nieuwe taak toevoegen..." },
  "tasks.add": { en: "Add", es: "Añadir", fr: "Ajouter", nl: "Toevoegen" },
  "tasks.import": { en: "Import", es: "Importar", fr: "Importer", nl: "Importeren" },
  "tasks.export": { en: "Export", es: "Exportar", fr: "Exporter", nl: "Exporteren" },
  "tasks.noTasks": { en: "No tasks yet", es: "Aún no hay tareas", fr: "Aucune tâche", nl: "Nog geen taken" },
  "tasks.addToStart": { en: "Add a task to get started", es: "Añade una tarea para comenzar", fr: "Ajoutez une tâche pour commencer", nl: "Voeg een taak toe om te beginnen" },
  "tasks.completed": { en: "Completed", es: "Completadas", fr: "Terminées", nl: "Voltooid" },

  // Theme names
  "theme.purpleSpace": { en: "Purple Space", es: "Espacio Púrpura", fr: "Espace Violet", nl: "Paarse Ruimte" },
  "theme.darkBlue": { en: "Dark Blue", es: "Azul Oscuro", fr: "Bleu Foncé", nl: "Donkerblauw" },
  "theme.darkMode": { en: "Dark Mode", es: "Modo Oscuro", fr: "Mode Sombre", nl: "Donkere Modus" },
  "theme.nesRetro": { en: "NES Retro", es: "Retro NES", fr: "NES Rétro", nl: "NES Retro" },
  "theme.netflix": { en: "Netflix", es: "Netflix", fr: "Netflix", nl: "Netflix" },
  "theme.isomorphic": { en: "Isomorphic", es: "Isomórfico", fr: "Isomorphique", nl: "Isomorf" },
  "theme.minimalist": { en: "Minimalist", es: "Minimalista", fr: "Minimaliste", nl: "Minimalistisch" },
  "theme.skeuomorphism": { en: "Skeuomorphism", es: "Skeuomorfismo", fr: "Skeuomorphisme", nl: "Skeuomorfisme" },
  "theme.flatDesign": { en: "Flat Design", es: "Diseño Plano", fr: "Design Plat", nl: "Plat Ontwerp" },
  "theme.bauhaus": { en: "Bauhaus", es: "Bauhaus", fr: "Bauhaus", nl: "Bauhaus" },
  "theme.neumorphism": { en: "Neumorphism", es: "Neumorfismo", fr: "Neumorphisme", nl: "Neumorfisme" },
  "theme.glassmorphism": { en: "Glassmorphism", es: "Glasmorfismo", fr: "Glassmorphisme", nl: "Glasmorfisme" },
  "theme.motion": { en: "Motion", es: "Movimiento", fr: "Mouvement", nl: "Beweging" },
  "theme.illustration": { en: "Illustration", es: "Ilustración", fr: "Illustration", nl: "Illustratie" },
  "theme.miroStyle": { en: "Miro Style", es: "Estilo Miro", fr: "Style Miro", nl: "Miro-stijl" },

  // Notes
  "notes.title": { en: "Notes & Planning", es: "Notas & Planificación", fr: "Notes & Planification", nl: "Notities & Planning" },
  "notes.export": { en: "Export", es: "Exportar", fr: "Exporter", nl: "Exporteren" },
  "notes.import": { en: "Import", es: "Importar", fr: "Importer", nl: "Importeren" },
  "notes.titlePlaceholder": { en: "Note title...", es: "Título de la nota...", fr: "Titre de la note...", nl: "Titel van de notitie..." },
  "notes.contentPlaceholder": { en: "Write your notes here. Use markdown, code, or plain text...", es: "Escribe tus notas aquí. Usa markdown, código o texto plano...", fr: "Écrivez vos notes ici. Markdown, code ou texte brut...", nl: "Schrijf hier je notities. Markdown, code of platte tekst..." },
  "notes.category": { en: "Category", es: "Categoría", fr: "Catégorie", nl: "Categorie" },
  "notes.category.technical": { en: "Technical", es: "Técnica", fr: "Technique", nl: "Technisch" },
  "notes.category.planning": { en: "Planning", es: "Planificación", fr: "Planification", nl: "Planning" },
  "notes.category.code": { en: "Code", es: "Código", fr: "Code", nl: "Code" },
  "notes.category.ideas": { en: "Ideas", es: "Ideas", fr: "Idées", nl: "Ideeën" },
  "notes.category.other": { en: "Other", es: "Otro", fr: "Autre", nl: "Overig" },
  "notes.tags": { en: "Tags (comma separated)", es: "Etiquetas (separadas por comas)", fr: "Tags (séparés par virgule)", nl: "Tags (komma-gescheiden)" },
  "notes.add": { en: "Add Note", es: "Añadir Nota", fr: "Ajouter une note", nl: "Notitie toevoegen" },
  "notes.save": { en: "Save", es: "Guardar", fr: "Enregistrer", nl: "Opslaan" },
  "notes.update": { en: "Update", es: "Actualizar", fr: "Mettre à jour", nl: "Bijwerken" },
  "notes.editNote": { en: "Edit Note", es: "Editar Nota", fr: "Modifier la note", nl: "Notitie bewerken" },
  "notes.deleteNote": { en: "Delete Note", es: "Eliminar Nota", fr: "Supprimer la note", nl: "Notitie verwijderen" },
  "notes.content": { en: "Content", es: "Contenido", fr: "Contenu", nl: "Inhoud" },
  "notes.search": { en: "Search notes...", es: "Buscar notas...", fr: "Rechercher des notes...", nl: "Notities zoeken..." },
  "notes.filter": { en: "Filter by", es: "Filtrar por", fr: "Filtrer par", nl: "Filteren op" },
  "notes.filter.all": { en: "All Categories", es: "Todas las Categorías", fr: "Toutes les catégories", nl: "Alle categorieën" },
  "notes.noNotes": { en: "No notes yet", es: "Aún no hay notas", fr: "Aucune note", nl: "Nog geen notities" },
  "notes.addToStart": { en: "Add a note to get started", es: "Añade una nota para comenzar", fr: "Ajoutez une note pour commencer", nl: "Voeg een notitie toe om te beginnen" },
  "notes.addFirstNote": { en: "Add your first note to start planning", es: "Agrega tu primera nota para comenzar a planificar", fr: "Ajoutez votre première note pour planifier", nl: "Voeg je eerste notitie toe om te plannen" },

  // Music
  "music.deleteConfirm.title": { en: "Remove track?", es: "¿Eliminar pista?", fr: "Supprimer la piste ?", nl: "Track verwijderen?" },
  "music.deleteConfirm.message": { en: "Are you sure you want to remove this track from your list?", es: "¿Estás seguro de que quieres eliminar esta pista de tu lista?", fr: "Voulez-vous vraiment supprimer cette piste ?", nl: "Weet je zeker dat je deze track wilt verwijderen?" },
  "music.deleteConfirm.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", nl: "Annuleren" },
  "music.deleteConfirm.confirm": { en: "Remove", es: "Eliminar", fr: "Supprimer", nl: "Verwijderen" },
};

export const t = (key: string, language: string): string => {
  if (!translations[key]) {
    console.warn(`Missing translation for: ${key}`);
    return key;
  }

  return translations[key][language as 'en' | 'es' | 'fr' | 'nl'] || translations[key].en;
};
