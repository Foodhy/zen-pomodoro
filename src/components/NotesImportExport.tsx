
import React from 'react';
import { Button } from './ui/button';
import { FileDown, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImportExportButtons from './ImportExportButtons';

const NotesImportExport: React.FC = () => {
  const { exportNotesToMarkdown, exportNotesToJson, importNotesFromJsonFile } = useApp();

  return (
    <div className="flex items-center gap-2">
      <ImportExportButtons
        onExport={exportNotesToJson}
        onImport={importNotesFromJsonFile}
        buttonSize="sm"
        exportLabel="Export JSON"
        importLabel="Import JSON"
      />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportNotesToMarkdown}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        Export MD
      </Button>
    </div>
  );
};

export default NotesImportExport;
