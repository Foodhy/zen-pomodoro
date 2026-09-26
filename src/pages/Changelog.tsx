import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CHANGELOG, typeColor } from "../data/changelog";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { t } from "../services/translationService";

const Changelog: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useApp();

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 md:py-10">
      <section className="w-full max-w-3xl rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {t("settings.changelogTitle", settings.language)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("settings.changelogDescription", settings.language)}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {CHANGELOG.map((entry) => (
              <article key={`${entry.version}-${entry.date}`} className="border-l-2 border-border pl-4">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">v{entry.version}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase ${typeColor[entry.type]}`}
                  >
                    {entry.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <p className="mb-1 text-sm font-medium">{entry.title}</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {entry.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
};

export default Changelog;
