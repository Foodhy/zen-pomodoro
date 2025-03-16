
import { Task, Note } from "../models/types";

export const exportTasksToJson = (tasks: Task[]): void => {
  const tasksJson = JSON.stringify(tasks, null, 2);
  const blob = new Blob([tasksJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "zen-pomodoro-tasks.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importTasksFromJson = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const tasks = JSON.parse(event.target.result as string) as Task[];
          resolve(tasks);
        } else {
          reject(new Error("Failed to read file content"));
        }
      } catch (error) {
        reject(new Error("Invalid JSON format"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
};

export const exportSessionsToMarkdown = (sessions: Record<string, any>): void => {
  let markdown = `# Pomodoro Productivity Log\n\n`;

  for (const date in sessions) {
    markdown += `## 📅 ${date}\n\n`;
    sessions[date].forEach((session: any, index: number) => {
      markdown += `### ✅ Session ${index + 1} (${session.time})\n`;
      markdown += `- **Type:** ${session.type}\n`;
      if (session.task) {
        markdown += `- **Task:** ${session.task}\n`;
      }
      if (session.notes) {
        markdown += `- **Notes:** ${session.notes}\n`;
      }
      markdown += `- **Duration:** ${Math.round(session.duration / 60)} minutes\n\n`;
    });
    markdown += "---\n\n";
  }

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pomodoro_log.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportNotesToMarkdown = (notes: Note[]): void => {
  let markdown = `# Notes and Planning Assistant\n\n`;

  // Group notes by category
  const categorizedNotes: Record<string, Note[]> = {};
  notes.forEach(note => {
    if (!categorizedNotes[note.category]) {
      categorizedNotes[note.category] = [];
    }
    categorizedNotes[note.category].push(note);
  });

  // Build markdown content by category
  for (const category in categorizedNotes) {
    markdown += `## ${getCategoryTitle(category)}\n\n`;
    
    categorizedNotes[category].forEach(note => {
      markdown += `### ${note.title}\n`;
      markdown += `*Created: ${new Date(note.createdAt).toLocaleString()}*\n\n`;
      
      // For code notes, format as code blocks
      if (category === 'code') {
        markdown += "```\n" + note.content + "\n```\n\n";
      } else {
        markdown += note.content + "\n\n";
      }
      
      // Add tags if present
      if (note.tags && note.tags.length > 0) {
        markdown += `**Tags:** ${note.tags.join(', ')}\n\n`;
      }
      
      markdown += "---\n\n";
    });
  }

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "notes_planner.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function getCategoryTitle(category: string): string {
  switch (category) {
    case 'technical':
      return '🧩 Technical Notes';
    case 'planning':
      return '📋 Planning Notes';
    case 'code':
      return '💻 Code Snippets';
    case 'ideas':
      return '💡 Ideas';
    case 'other':
      return '📝 Other Notes';
    default:
      return 'Notes';
  }
}
