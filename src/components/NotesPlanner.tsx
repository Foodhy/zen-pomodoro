
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Note, NoteCategory } from "../models/types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tag, 
  Trash, 
  Code, 
  Lightbulb, 
  ListChecks, 
  Puzzle, 
  Calendar, 
  Clipboard,
  Plus,
  ChevronUp,
  ChevronDown,
  Pencil
} from "lucide-react";
import NotesImportExport from "./NotesImportExport";
import { t } from "../services/translationService";

interface NotesPlannerProps {
  collapsed?: boolean;
}

const NOTE_COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#eab308", "#f97316", "#ec4899", "#64748b"];

const NotesPlanner: React.FC<NotesPlannerProps> = ({ collapsed = false }) => {
  const { notes, saveNote, deleteNote, moveNote, activeProfile, settings } = useApp();
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<NoteCategory>(NoteCategory.TECHNICAL);
  const [newNoteTags, setNewNoteTags] = useState("");
  const [newNoteColor, setNewNoteColor] = useState(NOTE_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (newNoteTitle.trim() && activeProfile) {
      const existing = editingId ? notes.find((note) => note.id === editingId) : undefined;
      const newNote: Note = {
        id: editingId || `note-${Date.now()}`,
        profileId: activeProfile.id,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        category: newNoteCategory,
        tags: newNoteTags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
        color: newNoteColor,
        order: existing?.order ?? notes.length,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveNote(newNote);
      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNoteTags("");
      setNewNoteColor(NOTE_COLORS[0]);
      setEditingId(null);
      setShowForm(false);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setNewNoteCategory(note.category);
    setNewNoteTags((note.tags || []).join(", "));
    setNewNoteColor(note.color || NOTE_COLORS[0]);
    setShowForm(true);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  if (collapsed) {
    return null;
  }

  // Filter notes based on category and search query
  const orderedNotes = [...notes].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.createdAt.localeCompare(b.createdAt)
  );

  const filteredNotes = orderedNotes.filter(note => {
    const matchesCategory = filter === "all" || note.category === filter;
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  // Get category icon
  const getCategoryIcon = (category: NoteCategory) => {
    switch (category) {
      case NoteCategory.TECHNICAL:
        return <Puzzle className="h-4 w-4" />;
      case NoteCategory.PLANNING:
        return <ListChecks className="h-4 w-4" />;
      case NoteCategory.CODE:
        return <Code className="h-4 w-4" />;
      case NoteCategory.IDEAS:
        return <Lightbulb className="h-4 w-4" />;
      case NoteCategory.OTHER:
        return <Clipboard className="h-4 w-4" />;
    }
  };

  // Get category color class
  const getCategoryColorClass = (category: NoteCategory) => {
    switch (category) {
      case NoteCategory.TECHNICAL:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case NoteCategory.PLANNING:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case NoteCategory.CODE:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case NoteCategory.IDEAS:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case NoteCategory.OTHER:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="h-full flex flex-col p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">{t("notes.title", settings.language)}</h2>
        <div className="flex items-center gap-1">
          <NotesImportExport />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowForm(v => !v)}
            aria-label={showForm ? t('notes.aria.hide', settings.language) : t('notes.aria.show', settings.language)}
          >
            {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Collapsible add form */}
      {showForm && (
        <form onSubmit={handleAddNote} className="space-y-2 mb-3">
          <Input
            type="text"
            placeholder={t("notes.titlePlaceholder", settings.language)}
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="text-sm"
            autoFocus
          />

          <Textarea
            placeholder={t("notes.contentPlaceholder", settings.language)}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="min-h-[70px] text-sm font-mono"
          />

          <div className="flex gap-2">
            <Select
              value={newNoteCategory}
              onValueChange={(value) => setNewNoteCategory(value as NoteCategory)}
            >
              <SelectTrigger className="text-xs flex-1">
                <SelectValue placeholder={t("notes.category", settings.language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NoteCategory.TECHNICAL}>{t("notes.category.technical", settings.language)}</SelectItem>
                <SelectItem value={NoteCategory.PLANNING}>{t("notes.category.planning", settings.language)}</SelectItem>
                <SelectItem value={NoteCategory.CODE}>{t("notes.category.code", settings.language)}</SelectItem>
                <SelectItem value={NoteCategory.IDEAS}>{t("notes.category.ideas", settings.language)}</SelectItem>
                <SelectItem value={NoteCategory.OTHER}>{t("notes.category.other", settings.language)}</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder={t("notes.tags", settings.language)}
              value={newNoteTags}
              onChange={(e) => setNewNoteTags(e.target.value)}
              className="text-xs flex-1"
            />
          </div>
          <div className="flex items-center gap-2" role="group" aria-label={t("notes.color", settings.language)}>
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="h-5 w-5 rounded-full border-2"
                style={{
                  backgroundColor: color,
                  borderColor: newNoteColor === color ? "white" : "transparent",
                }}
                aria-label={color}
                onClick={() => setNewNoteColor(color)}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => setShowForm(false)}
            >
              {t('notes.cancel', settings.language)}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1"
              disabled={!newNoteTitle.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              {editingId ? t("notes.save", settings.language) : t("notes.add", settings.language)}
            </Button>
          </div>
        </form>
      )}

      {/* Search + filter */}
      <div className="flex gap-2 mb-3">
        <Input
          type="text"
          placeholder={t("notes.search", settings.language)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm"
        />

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="text-xs w-[130px]">
            <SelectValue placeholder={t("notes.filter", settings.language)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("notes.filter.all", settings.language)}</SelectItem>
            <SelectItem value={NoteCategory.TECHNICAL}>{t("notes.category.technical", settings.language)}</SelectItem>
            <SelectItem value={NoteCategory.PLANNING}>{t("notes.category.planning", settings.language)}</SelectItem>
            <SelectItem value={NoteCategory.CODE}>{t("notes.category.code", settings.language)}</SelectItem>
            <SelectItem value={NoteCategory.IDEAS}>{t("notes.category.ideas", settings.language)}</SelectItem>
            <SelectItem value={NoteCategory.OTHER}>{t("notes.category.other", settings.language)}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto pb-8">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <p className="text-sm">{t("notes.noNotes", settings.language)}</p>
            <p className="text-xs mt-1">{t("notes.addToStart", settings.language)}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className="p-3 rounded-lg border border-border/30 hover:border-border/60 transition-colors"
                style={{ borderLeft: `4px solid ${note.color || "#64748b"}` }}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{note.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${getCategoryColorClass(note.category)}`}>
                        {getCategoryIcon(note.category)}
                        {t(`notes.category.${note.category}`, settings.language)}
                      </span>
                      <span className="text-xs opacity-50 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0">
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" disabled={index === 0} onClick={() => moveNote(note.id, "up")} aria-label={t("notes.moveUp", settings.language)}>
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" disabled={index === filteredNotes.length - 1} onClick={() => moveNote(note.id, "down")} aria-label={t("notes.moveDown", settings.language)}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => startEdit(note)} aria-label={t("notes.editNote", settings.language)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-40 hover:opacity-100" onClick={() => handleDeleteNote(note.id)}>
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {note.category === NoteCategory.CODE ? (
                  <pre className="bg-secondary/30 p-2 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap mt-1.5">
                    {note.content}
                  </pre>
                ) : (
                  <p className="text-sm whitespace-pre-wrap text-foreground/80 mt-1.5">
                    {note.content}
                  </p>
                )}

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/50 text-xs"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPlanner;
