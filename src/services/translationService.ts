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
  "settings.notificationSound": { en: "Notification sound", es: "Sonido de aviso", fr: "Son de notification", nl: "Meldingsgeluid" },
  "settings.sound.classic": { en: "Classic", es: "Clásico", fr: "Classique", nl: "Klassiek" },
  "settings.sound.chime": { en: "Chime", es: "Campanilla", fr: "Carillon", nl: "Beltoon" },
  "settings.sound.bell": { en: "Bell", es: "Campana", fr: "Cloche", nl: "Bel" },
  "settings.autoContinue": { en: "Auto-start the next phase", es: "Iniciar sola la siguiente fase", fr: "Lancer la phase suivante", nl: "Volgende fase automatisch starten" },
  "settings.autoContinueHelp": { en: "Off keeps the current behavior: the timer stops between focus and breaks. On continues the cycle automatically.", es: "Apagado mantiene el comportamiento actual: el temporizador se detiene entre foco y descansos. Encendido continúa el ciclo solo.", fr: "Désactivé conserve le comportement actuel : le minuteur s'arrête entre focus et pauses. Activé enchaîne le cycle.", nl: "Uit houdt het huidige gedrag: de timer stopt tussen focus en pauzes. Aan laat de cyclus vanzelf doorlopen." },
  "settings.display": { en: "Display", es: "Visualización", fr: "Affichage", nl: "Weergave" },
  "settings.splitViewMode": { en: "Split view mode", es: "Modo vista dividida", fr: "Mode vue divisée", nl: "Gesplitste weergave" },
  "settings.keyboard": { en: "Keyboard", es: "Teclado", fr: "Clavier", nl: "Toetsenbord" },
  "settings.keyboardShortcuts": { en: "Keyboard shortcuts", es: "Atajos de teclado", fr: "Raccourcis clavier", nl: "Sneltoetsen" },
  "settings.viewShortcuts": { en: "View keyboard shortcuts", es: "Ver atajos de teclado", fr: "Voir les raccourcis", nl: "Bekijk sneltoetsen" },
  "settings.resetStorage": { en: "Reset all data", es: "Restablecer todos los datos", fr: "Réinitialiser toutes les données", nl: "Alle gegevens resetten" },
  "settings.viewChangelog": { en: "View changelog", es: "Ver changelog", fr: "Voir le changelog", nl: "Bekijk changelog" },
  "settings.changelogTitle": { en: "Changelog", es: "Changelog", fr: "Changelog", nl: "Changelog" },
  "settings.changelogDescription": { en: "All changes to the app", es: "Todos los cambios de la app (solo en inglés)", fr: "Toutes les modifications de l'app (anglais uniquement)", nl: "Alle wijzigingen aan de app (alleen Engels)" },
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

  // Header / common UI
  "header.changeLanguage": { en: "Change language", es: "Cambiar idioma", fr: "Changer de langue", nl: "Taal wijzigen" },
  "header.toggleFullscreen": { en: "Toggle fullscreen", es: "Alternar pantalla completa", fr: "Basculer le plein écran", nl: "Volledig scherm schakelen" },
  "header.openSettings": { en: "Open settings", es: "Abrir configuración", fr: "Ouvrir les paramètres", nl: "Instellingen openen" },

  // Tabs
  "tabs.timer": { en: "Timer", es: "Temporizador", fr: "Minuteur", nl: "Timer" },
  "tabs.tasks": { en: "Tasks", es: "Tareas", fr: "Tâches", nl: "Taken" },
  "tabs.notes": { en: "Notes", es: "Notas", fr: "Notes", nl: "Notities" },
  "tabs.history": { en: "History", es: "Historial", fr: "Historique", nl: "Geschiedenis" },
  "tabs.music": { en: "Music", es: "Música", fr: "Musique", nl: "Muziek" },

  // Bottom bar / stats
  "stats.pomodoros": { en: "Pomodoros", es: "Pomodoros", fr: "Pomodoros", nl: "Pomodoros" },
  "stats.totalFocus": { en: "Total Focus", es: "Concentración total", fr: "Focus total", nl: "Totale focus" },
  "stats.minShort": { en: "min", es: "min", fr: "min", nl: "min" },

  // Timer
  "timer.work": { en: "Work", es: "Trabajo", fr: "Travail", nl: "Werk" },
  "timer.shortBreak": { en: "Short Break", es: "Descanso Corto", fr: "Petite pause", nl: "Korte pauze" },
  "timer.longBreak": { en: "Long Break", es: "Descanso Largo", fr: "Longue pause", nl: "Lange pauze" },
  "timer.start": { en: "Start", es: "Iniciar", fr: "Démarrer", nl: "Start" },
  "timer.pause": { en: "Pause", es: "Pausar", fr: "Pause", nl: "Pauze" },
  "timer.reset": { en: "Reset", es: "Reiniciar", fr: "Réinitialiser", nl: "Reset" },
  "timer.skip": { en: "Skip", es: "Saltar", fr: "Passer", nl: "Overslaan" },
  "timer.phase.focus": { en: "Focus", es: "Concentración", fr: "Concentration", nl: "Focus" },
  "timer.phase.break": { en: "Break", es: "Descanso", fr: "Pause", nl: "Pauze" },
  "timer.phase.longBreak": { en: "Long Break", es: "Descanso Largo", fr: "Longue pause", nl: "Lange pauze" },
  "timer.paused": { en: "paused", es: "pausado", fr: "en pause", nl: "gepauzeerd" },
  "timer.aria.reset": { en: "Reset timer", es: "Reiniciar temporizador", fr: "Réinitialiser le minuteur", nl: "Timer resetten" },
  "timer.aria.pause": { en: "Pause timer", es: "Pausar temporizador", fr: "Mettre en pause", nl: "Timer pauzeren" },
  "timer.aria.start": { en: "Start timer", es: "Iniciar temporizador", fr: "Démarrer le minuteur", nl: "Timer starten" },
  "timer.aria.skip": { en: "Skip phase", es: "Saltar fase", fr: "Passer la phase", nl: "Fase overslaan" },
  "timer.pomodoroToday.one": { en: "{count} pomodoro today", es: "{count} pomodoro hoy", fr: "{count} pomodoro aujourd'hui", nl: "{count} pomodoro vandaag" },
  "timer.pomodoroToday.other": { en: "{count} pomodoros today", es: "{count} pomodoros hoy", fr: "{count} pomodoros aujourd'hui", nl: "{count} pomodoros vandaag" },

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
  "tasks.aria.edit": { en: "Edit task", es: "Editar tarea", fr: "Modifier la tâche", nl: "Taak bewerken" },
  "tasks.aria.delete": { en: "Delete task", es: "Eliminar tarea", fr: "Supprimer la tâche", nl: "Taak verwijderen" },
  "tasks.aria.calendar": { en: "Set reminder date", es: "Fecha de recordatorio", fr: "Date de rappel", nl: "Herinneringsdatum" },
  "tasks.aria.time": { en: "Set reminder time", es: "Hora de recordatorio", fr: "Heure de rappel", nl: "Herinneringstijd" },
  "tasks.aria.save": { en: "Save changes", es: "Guardar cambios", fr: "Enregistrer", nl: "Opslaan" },

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
  "theme.meteorShower": { en: "Meteor Shower", es: "Lluvia de Meteoros", fr: "Pluie de Météores", nl: "Meteorenregen" },
  "theme.particleNetwork": { en: "Particle Network", es: "Red de Partículas", fr: "Réseau de Particules", nl: "Deeltjesnetwerk" },
  "theme.flickerMatrix": { en: "Flicker Matrix", es: "Matriz Parpadeante", fr: "Matrice Vacillante", nl: "Flikkerend Raster" },
  "theme.retroWave": { en: "Retro Wave", es: "Onda Retro", fr: "Vague Rétro", nl: "Retrogolf" },
  "theme.blueprint": { en: "Blueprint", es: "Plano", fr: "Bleu de plan", nl: "Blauwdruk" },
  "theme.graphPaper": { en: "Graph Paper", es: "Papel milimetrado", fr: "Papier millimétré", nl: "Ruitjespapier" },
  "theme.filament": { en: "Filament", es: "Filamento", fr: "Filament", nl: "Filament" },
  "theme.brutalist": { en: "Brutalist", es: "Brutalista", fr: "Brutaliste", nl: "Brutalist" },
  "theme.kraft": { en: "Kraft", es: "Kraft", fr: "Kraft", nl: "Kraft" },

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
  "notes.color": { en: "Note color", es: "Color de la nota", fr: "Couleur de la note", nl: "Notitiekleur" },
  "notes.moveUp": { en: "Move note up", es: "Subir nota", fr: "Monter la note", nl: "Notitie omhoog" },
  "notes.moveDown": { en: "Move note down", es: "Bajar nota", fr: "Descendre la note", nl: "Notitie omlaag" },
  "notes.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", nl: "Annuleren" },
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
  "notes.aria.show": { en: "Add note", es: "Añadir nota", fr: "Ajouter une note", nl: "Notitie toevoegen" },
  "notes.aria.hide": { en: "Hide add note form", es: "Ocultar formulario", fr: "Masquer le formulaire", nl: "Formulier verbergen" },
  "notes.exportJson": { en: "Export JSON", es: "Exportar JSON", fr: "Exporter JSON", nl: "JSON exporteren" },
  "notes.importJson": { en: "Import JSON", es: "Importar JSON", fr: "Importer JSON", nl: "JSON importeren" },
  "notes.exportMarkdown": { en: "Export Markdown", es: "Exportar Markdown", fr: "Exporter Markdown", nl: "Markdown exporteren" },

  // Music
  "music.title": { en: "Music & Ambience", es: "Música y Ambiente", fr: "Musique & Ambiance", nl: "Muziek & sfeer" },
  "music.addVideo": { en: "Add video", es: "Añadir video", fr: "Ajouter une vidéo", nl: "Video toevoegen" },
  "music.restore": { en: "Restore default music", es: "Restaurar música predeterminada", fr: "Restaurer la musique par défaut", nl: "Standaardmuziek herstellen" },
  "music.edit": { en: "Edit", es: "Editar", fr: "Modifier", nl: "Bewerken" },
  "music.editVideo": { en: "Edit Video", es: "Editar Video", fr: "Modifier la vidéo", nl: "Video bewerken" },
  "music.title.field": { en: "Title", es: "Título", fr: "Titre", nl: "Titel" },
  "music.url.field": { en: "YouTube URL", es: "URL de YouTube", fr: "URL YouTube", nl: "YouTube-URL" },
  "music.title.placeholder": { en: "e.g. Lofi Hip Hop Radio", es: "ej. Radio Lofi Hip Hop", fr: "ex. Radio Lofi Hip Hop", nl: "bv. Lofi Hip Hop Radio" },
  "music.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", nl: "Annuleren" },
  "music.add": { en: "Add", es: "Añadir", fr: "Ajouter", nl: "Toevoegen" },
  "music.update": { en: "Update", es: "Actualizar", fr: "Mettre à jour", nl: "Bijwerken" },
  "music.empty": { en: "No videos yet", es: "Aún no hay videos", fr: "Aucune vidéo", nl: "Nog geen video's" },
  "music.addFirst": { en: "Add your first video", es: "Añade tu primer video", fr: "Ajoutez votre première vidéo", nl: "Voeg je eerste video toe" },
  "music.exportJson": { en: "Export videos", es: "Exportar videos", fr: "Exporter les vidéos", nl: "Video's exporteren" },
  "music.importJson": { en: "Import videos", es: "Importar videos", fr: "Importer des vidéos", nl: "Video's importeren" },
  "music.deleteConfirm.title": { en: "Remove track?", es: "¿Eliminar pista?", fr: "Supprimer la piste ?", nl: "Track verwijderen?" },
  "music.deleteConfirm.message": { en: "Are you sure you want to remove this track from your list?", es: "¿Estás seguro de que quieres eliminar esta pista de tu lista?", fr: "Voulez-vous vraiment supprimer cette piste ?", nl: "Weet je zeker dat je deze track wilt verwijderen?" },
  "music.deleteConfirm.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", nl: "Annuleren" },
  "music.deleteConfirm.confirm": { en: "Remove", es: "Eliminar", fr: "Supprimer", nl: "Verwijderen" },
  "music.group.youtube": { en: "YouTube", es: "YouTube", fr: "YouTube", nl: "YouTube" },
  "music.group.soundcloud": { en: "SoundCloud", es: "SoundCloud", fr: "SoundCloud", nl: "SoundCloud" },
  "music.group.spotify": { en: "Spotify", es: "Spotify", fr: "Spotify", nl: "Spotify" },
  "music.group.other": { en: "Other", es: "Otros", fr: "Autres", nl: "Overig" },
  "music.spotify.note": {
    en: "Note: To listen to full Spotify tracks, you need to be signed in to Spotify in this browser. Otherwise only a 30-second preview will play.",
    es: "Nota: Para escuchar las canciones completas de Spotify, necesitas tener la sesión iniciada en Spotify en este navegador. De lo contrario solo sonará una vista previa de 30 segundos.",
    fr: "Remarque : Pour écouter les morceaux Spotify en entier, vous devez être connecté à Spotify dans ce navigateur. Sinon, seul un aperçu de 30 secondes sera lu.",
    nl: "Let op: om volledige Spotify-tracks te beluisteren, moet je in deze browser bij Spotify zijn aangemeld. Anders speelt alleen een voorbeeld van 30 seconden."
  },

  // History
  "history.title": { en: "Session History", es: "Historial de sesiones", fr: "Historique des sessions", nl: "Sessiegeschiedenis" },
  "history.exportJson": { en: "Export JSON", es: "Exportar JSON", fr: "Exporter JSON", nl: "JSON exporteren" },
  "history.importJson": { en: "Import JSON", es: "Importar JSON", fr: "Importer JSON", nl: "JSON importeren" },
  "history.exportMarkdown": { en: "Export Markdown", es: "Exportar Markdown", fr: "Exporter Markdown", nl: "Markdown exporteren" },
  "history.stats.focusSessions": { en: "Focus sessions", es: "Sesiones de focus", fr: "Sessions de focus", nl: "Focussessies" },
  "history.stats.totalFocus": { en: "Total focus", es: "Focus total", fr: "Focus total", nl: "Totale focus" },
  "history.stats.activeDays": { en: "Active days", es: "Días activos", fr: "Jours actifs", nl: "Actieve dagen" },
  "history.day.today": { en: "Today", es: "Hoy", fr: "Aujourd'hui", nl: "Vandaag" },
  "history.day.yesterday": { en: "Yesterday", es: "Ayer", fr: "Hier", nl: "Gisteren" },
  "history.day.focusBadge": { en: "{count} focus", es: "{count} focus", fr: "{count} focus", nl: "{count} focus" },
  "history.type.focus": { en: "Focus", es: "Concentración", fr: "Concentration", nl: "Focus" },
  "history.type.shortBreak": { en: "Short Break", es: "Descanso corto", fr: "Petite pause", nl: "Korte pauze" },
  "history.type.longBreak": { en: "Long Break", es: "Descanso largo", fr: "Longue pause", nl: "Lange pauze" },
  "history.empty.title": { en: "No sessions yet", es: "Aún no hay sesiones", fr: "Aucune session", nl: "Nog geen sessies" },
  "history.empty.subtitle": { en: "Start a Pomodoro to begin tracking your focus history.", es: "Inicia un Pomodoro para empezar a registrar tu historial.", fr: "Démarrez un Pomodoro pour suivre votre historique.", nl: "Start een Pomodoro om je focusgeschiedenis bij te houden." },

  // Profiles
  "profile.fallback": { en: "Profile", es: "Perfil", fr: "Profil", nl: "Profiel" },
  "profile.create.title": { en: "Create New Profile", es: "Crear nuevo perfil", fr: "Créer un nouveau profil", nl: "Nieuw profiel maken" },
  "profile.create.description": { en: "Create a new profile with custom Pomodoro settings.", es: "Crea un nuevo perfil con tus ajustes de Pomodoro.", fr: "Créez un profil avec vos réglages Pomodoro.", nl: "Maak een nieuw profiel met je Pomodoro-instellingen." },
  "profile.edit.title": { en: "Edit Profile", es: "Editar perfil", fr: "Modifier le profil", nl: "Profiel bewerken" },
  "profile.edit.description": { en: "Update your profile settings.", es: "Actualiza los ajustes del perfil.", fr: "Mettez à jour vos paramètres.", nl: "Werk je profielinstellingen bij." },
  "profile.delete.title": { en: "Delete Profile", es: "Eliminar perfil", fr: "Supprimer le profil", nl: "Profiel verwijderen" },
  "profile.delete.description": { en: "Are you sure you want to delete this profile? This will also delete all associated tasks and history.", es: "¿Seguro que quieres eliminar este perfil? Se borrarán todas las tareas e historial asociados.", fr: "Voulez-vous vraiment supprimer ce profil ? Toutes les tâches et l'historique associés seront également supprimés.", nl: "Weet je zeker dat je dit profiel wilt verwijderen? Alle taken en geschiedenis worden ook verwijderd." },
  "profile.name": { en: "Profile Name", es: "Nombre del perfil", fr: "Nom du profil", nl: "Profielnaam" },
  "profile.namePlaceholder": { en: "e.g., Coding, Reading", es: "p. ej. Programar, Leer", fr: "ex. Coder, Lire", nl: "bv. Coderen, Lezen" },
  "profile.workDuration": { en: "Work Duration (min)", es: "Duración de trabajo (min)", fr: "Durée de travail (min)", nl: "Werkduur (min)" },
  "profile.shortBreak": { en: "Short Break (min)", es: "Descanso corto (min)", fr: "Petite pause (min)", nl: "Korte pauze (min)" },
  "profile.longBreak": { en: "Long Break (min)", es: "Descanso largo (min)", fr: "Longue pause (min)", nl: "Lange pauze (min)" },
  "profile.longBreakAfter": { en: "Long Break After", es: "Descanso largo cada", fr: "Longue pause après", nl: "Lange pauze na" },
  "profile.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler", nl: "Annuleren" },
  "profile.create": { en: "Create Profile", es: "Crear perfil", fr: "Créer le profil", nl: "Profiel maken" },
  "profile.save": { en: "Save Changes", es: "Guardar cambios", fr: "Enregistrer", nl: "Opslaan" },
  "profile.delete": { en: "Delete", es: "Eliminar", fr: "Supprimer", nl: "Verwijderen" },

  // Notifications
  "notif.work.completed.title": { en: "Work session completed!", es: "¡Sesión de trabajo completada!", fr: "Session de travail terminée !", nl: "Werksessie voltooid!" },
  "notif.work.completed.body": { en: "Time for a break. Stand up and stretch a bit.", es: "Es hora de un descanso. Levántate y estírate un poco.", fr: "C'est l'heure d'une pause. Levez-vous et étirez-vous.", nl: "Tijd voor een pauze. Sta op en rek je even uit." },
  "notif.shortBreak.completed.title": { en: "Break time is over!", es: "¡Se acabó el descanso!", fr: "La pause est terminée !", nl: "De pauze is voorbij!" },
  "notif.shortBreak.completed.body": { en: "Ready to get back to work?", es: "¿Listo para volver al trabajo?", fr: "Prêt à reprendre le travail ?", nl: "Klaar om weer aan de slag te gaan?" },
  "notif.longBreak.completed.title": { en: "Long break completed!", es: "¡Descanso largo completado!", fr: "Longue pause terminée !", nl: "Lange pauze voltooid!" },
  "notif.longBreak.completed.body": { en: "Ready for a new productive session?", es: "¿Listo para una nueva sesión productiva?", fr: "Prêt pour une nouvelle session productive ?", nl: "Klaar voor een nieuwe productieve sessie?" },
  "notif.work.started.title": { en: "Work phase started", es: "Fase de trabajo iniciada", fr: "Phase de travail démarrée", nl: "Werkfase gestart" },
  "notif.work.started.body": { en: "Focus on your task. You can do it!", es: "Concéntrate en tu tarea. ¡Tú puedes!", fr: "Concentrez-vous sur votre tâche. Vous pouvez le faire !", nl: "Concentreer je op je taak. Je kunt het!" },
  "notif.shortBreak.started.title": { en: "Short break started", es: "Descanso corto iniciado", fr: "Petite pause démarrée", nl: "Korte pauze gestart" },
  "notif.shortBreak.started.body": { en: "Take a moment to relax.", es: "Tómate un momento para relajarte.", fr: "Prenez un moment pour vous détendre.", nl: "Neem even de tijd om te ontspannen." },
  "notif.longBreak.started.title": { en: "Long break started", es: "Descanso largo iniciado", fr: "Longue pause démarrée", nl: "Lange pauze gestart" },
  "notif.longBreak.started.body": { en: "Time for an extended break. Rest well!", es: "Tiempo para un descanso largo. ¡Descansa bien!", fr: "Place à une longue pause. Reposez-vous bien !", nl: "Tijd voor een lange pauze. Rust goed uit!" },
  "notif.task.reminder.title": { en: "Task Reminder", es: "Recordatorio de tarea", fr: "Rappel de tâche", nl: "Taakherinnering" },
  "notif.task.reminder.body": { en: "It's time for: {task}", es: "Es hora de: {task}", fr: "C'est l'heure de : {task}", nl: "Tijd voor: {task}" },
};

export type Lang = 'en' | 'es' | 'fr' | 'nl';

export const t = (key: string, language: string): string => {
  if (!translations[key]) {
    console.warn(`Missing translation for: ${key}`);
    return key;
  }

  return translations[key][language as Lang] || translations[key].en;
};

/** Translate with simple {placeholder} interpolation. */
export const tf = (
  key: string,
  language: string,
  vars: Record<string, string | number> = {}
): string => {
  let value = t(key, language);
  for (const [name, val] of Object.entries(vars)) {
    value = value.replace(new RegExp(`\\{${name}\\}`, 'g'), String(val));
  }
  return value;
};

/** Pluralized translation. Picks `${key}.one` for count===1, otherwise `${key}.other`. */
export const tn = (
  key: string,
  language: string,
  count: number,
  vars: Record<string, string | number> = {}
): string => {
  const suffix = count === 1 ? 'one' : 'other';
  return tf(`${key}.${suffix}`, language, { count, ...vars });
};
