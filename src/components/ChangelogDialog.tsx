import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { t } from "../services/translationService";
import { LanguageOption } from "../models/types";
import { CHANGELOG, typeColor } from "../data/changelog";

interface ChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: LanguageOption;
}

export const ChangelogDialog: React.FC<ChangelogDialogProps> = ({
  open,
  onOpenChange,
  language,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("settings.changelogTitle", language)}</DialogTitle>
          <DialogDescription>
            {t("settings.changelogDescription", language)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {CHANGELOG.map((entry) => (
              <div key={entry.version} className="border-l-2 border-border pl-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm">v{entry.version}</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <Badge variant="outline" className={`text-[10px] uppercase ${typeColor[entry.type]}`}>
                    {entry.type}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-2">{entry.title}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {entry.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogDialog;
