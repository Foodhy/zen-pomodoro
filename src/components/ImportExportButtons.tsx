
import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Download, Upload } from 'lucide-react';

interface ImportExportButtonsProps {
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  buttonSize?: 'default' | 'sm';
  exportLabel?: string;
  importLabel?: string;
  exportTitle?: string;
  importTitle?: string;
  hidden?: boolean;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  onExport,
  onImport,
  buttonSize = 'default',
  exportLabel = 'Export',
  importLabel = 'Import',
  exportTitle,
  importTitle,
  hidden = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await onImport(files[0]);
        e.target.value = ''; // Reset the input
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing file. Please check the file format.');
      }
    }
  };

  if (hidden) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={buttonSize}
        onClick={onExport}
        className="flex items-center gap-1"
        title={exportTitle ?? exportLabel}
        aria-label={exportTitle ?? exportLabel}
      >
        <Download className="h-4 w-4" />
        {exportLabel}
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleImportClick}
        className="flex items-center gap-1"
        title={importTitle ?? importLabel}
        aria-label={importTitle ?? importLabel}
      >
        <Upload className="h-4 w-4" />
        {importLabel}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImportExportButtons;
