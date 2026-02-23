
import React, { useState, useRef } from "react";
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
  Plus
} from "lucide-react";
import NotesImportExport from "./NotesImportExport";
import { t } from "../services/translationService";

interface NotesPlannerProps {
  collapsed?: boolean;
}

const NotesPlanner: React.FC<NotesPlannerProps> = ({ collapsed = false }) => {
  const { notes, saveNote, deleteNote, activeProfile, settings, exportNotesToMarkdown } = useApp();
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<NoteCategory>(NoteCategory.TECHNICAL);
  const [newNoteTags, setNewNoteTags] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (newNoteTitle.trim() && activeProfile) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        profileId: activeProfile.id,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        category: newNoteCategory,
        tags: newNoteTags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveNote(newNote);
      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNoteTags("");
    }
  };

  const handleExportNotes = () => {
    exportNotesToMarkdown();
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  if (collapsed) {
    return null;
  }

  // Filter notes based on category and search query
  const filteredNotes = notes.filter(note => {
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium opacity-70 pl-2">{t("notes.title", settings.language)}</h2>
        <NotesImportExport />
      </div>

      <form onSubmit={handleAddNote} className="space-y-2 mb-3 p-2.5 border border-border/30 rounded-md">
        <Input
          type="text"
          placeholder={t("notes.titlePlaceholder", settings.language)}
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="text-sm"
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
        
        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("notes.add", settings.language)}
        </Button>
      </form>

      <div className="flex gap-2 mb-3 pl-2">
        <Input
          type="text"
          placeholder={t("notes.search", settings.language)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm"
        />
        
        <Select 
          value={filter} 
          onValueChange={setFilter}
        >
          <SelectTrigger className="text-xs w-[150px]">
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

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <p className="text-sm">{t("notes.noNotes", settings.language)}</p>
            <p className="text-xs mt-1">{t("notes.addToStart", settings.language)}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="miro-card p-3 rounded-lg border border-border/30 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-sm">{note.title}</h3>
                    <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getCategoryColorClass(note.category)}`}>
                      {getCategoryIcon(note.category)}
                      <span className="ml-1">
                        {t(`notes.category.${note.category}`, settings.language)}
                      </span>
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                {note.category === NoteCategory.CODE ? (
                  <pre className="bg-secondary/30 p-2 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                    {note.content}
                  </pre>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
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
