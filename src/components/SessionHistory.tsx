
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FileDown, FileMd, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import ImportExportButtons from './ImportExportButtons';

const SessionHistory = () => {
  const { sessions, exportSessionsToMarkdown, exportSessionsToJson, importSessionsFromJsonFile } = useApp();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Group sessions by date
  const sessionsByDate = sessions.reduce<Record<string, typeof sessions>>((acc, session) => {
    const date = format(new Date(session.startTime), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {});

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Toggle selected date
  const toggleDate = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Session History</CardTitle>
          <div className="flex items-center gap-2">
            <ImportExportButtons
              onExport={exportSessionsToJson}
              onImport={importSessionsFromJsonFile}
              buttonSize="sm"
              exportLabel="Export JSON"
              importLabel="Import JSON"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportSessionsToMarkdown}
              className="flex items-center gap-1"
            >
              <FileMd className="h-4 w-4" />
              Export MD
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedDates.length > 0 ? (
          <div className="space-y-2">
            {sortedDates.map(date => (
              <div key={date} className="border rounded-md">
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center p-3"
                  onClick={() => toggleDate(date)}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(date), 'PPP')}</span>
                  </div>
                  <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                    {sessionsByDate[date].length} sessions
                  </span>
                </Button>
                
                {selectedDate === date && (
                  <div className="px-4 pb-4 space-y-2">
                    {sessionsByDate[date]
                      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                      .map(session => (
                        <div key={session.id} className="border-l-4 border-primary pl-3 py-2">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {format(new Date(session.startTime), 'p')}
                            </span>
                            <span className="text-sm">
                              {session.type.charAt(0).toUpperCase() + session.type.slice(1)} • 
                              {Math.round(session.duration / 60)} min
                            </span>
                          </div>
                          {session.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{session.notes}</p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No sessions recorded yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
