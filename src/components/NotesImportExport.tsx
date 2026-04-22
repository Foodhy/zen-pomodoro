
import React from 'react';
import { Button } from './ui/button';
import { FileText, FileDown, FileUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../services/translationService';

const NotesImportExport: React.FC = () => {
  const { exportNotesToMarkdown, exportNotesToJson, importNotesFromJsonFile, settings } = useApp();
  const lang = settings.language;

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) importNotesFromJsonFile(file);
    };
    input.click();
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={exportNotesToJson}
        title={t('notes.exportJson', lang)}
        aria-label={t('notes.exportJson', lang)}
      >
        <FileDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleImportClick}
        title={t('notes.importJson', lang)}
        aria-label={t('notes.importJson', lang)}
      >
        <FileUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={exportNotesToMarkdown}
        title={t('notes.exportMarkdown', lang)}
        aria-label={t('notes.exportMarkdown', lang)}
      >
        <FileText className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default NotesImportExport;
