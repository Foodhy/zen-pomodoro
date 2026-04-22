import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
  FileDown,
  FileText,
  Upload,
  ChevronDown,
  Brain,
  Coffee,
  Moon,
  Clock,
  Flame,
  CalendarDays,
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { enUS, es, fr, nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { t, tf } from '../services/translationService';

const TYPE_META = {
  work: {
    labelKey: 'history.type.focus',
    Icon: Brain,
    dot: 'bg-primary',
    text: 'text-primary',
    bg: 'bg-primary/10',
  },
  shortBreak: {
    labelKey: 'history.type.shortBreak',
    Icon: Coffee,
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  longBreak: {
    labelKey: 'history.type.longBreak',
    Icon: Moon,
    dot: 'bg-sky-400',
    text: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
} as const;

const LOCALES = { en: enUS, es, fr, nl } as const;

const getLocale = (lang: string) =>
  LOCALES[lang as keyof typeof LOCALES] ?? enUS;

const SessionHistory = () => {
  const {
    sessions,
    settings,
    exportSessionsToMarkdown,
    exportSessionsToJson,
    importSessionsFromJsonFile,
  } = useApp();
  const lang = settings.language;
  const locale = getLocale(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return t('history.day.today', lang);
    if (isYesterday(date)) return t('history.day.yesterday', lang);
    return format(date, 'EEEE, MMM d', { locale });
  };

  const { sessionsByDate, sortedDates, totals } = useMemo(() => {
    const byDate = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
      const date = format(new Date(s.startTime), 'yyyy-MM-dd');
      (acc[date] ||= []).push(s);
      return acc;
    }, {});

    const dates = Object.keys(byDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const totalFocusMin = Math.round(
      sessions
        .filter((s) => s.type === 'work')
        .reduce((sum, s) => sum + s.duration, 0) / 60
    );
    const focusCount = sessions.filter((s) => s.type === 'work').length;

    return {
      sessionsByDate: byDate,
      sortedDates: dates,
      totals: { focusMin: totalFocusMin, focusCount, days: dates.length },
    };
  }, [sessions]);

  // Auto-open most recent day
  React.useEffect(() => {
    if (sortedDates.length && openDates.size === 0) {
      setOpenDates(new Set([sortedDates[0]]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDates.length]);

  const toggleDate = (date: string) => {
    setOpenDates((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  };

  return (
    <Card className="w-full bg-background/40 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold tracking-tight">
              {t('history.title', lang)}
            </CardTitle>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={exportSessionsToJson}
              title={t('history.exportJson', lang)}
              aria-label={t('history.exportJson', lang)}
            >
              <FileDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              title={t('history.importJson', lang)}
              aria-label={t('history.importJson', lang)}
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={exportSessionsToMarkdown}
              title={t('history.exportMarkdown', lang)}
              aria-label={t('history.exportMarkdown', lang)}
            >
              <FileText className="h-3.5 w-3.5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={async (e) => {
                const files = e.target.files;
                if (files?.[0]) {
                  await importSessionsFromJsonFile(files[0]);
                  e.target.value = '';
                }
              }}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Stats row */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            <StatPill
              icon={<Flame className="h-3.5 w-3.5" />}
              label={t('history.stats.focusSessions', lang)}
              value={totals.focusCount.toString()}
            />
            <StatPill
              icon={<Clock className="h-3.5 w-3.5" />}
              label={t('history.stats.totalFocus', lang)}
              value={`${totals.focusMin}m`}
            />
            <StatPill
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label={t('history.stats.activeDays', lang)}
              value={totals.days.toString()}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="px-3 pb-3">
        {sortedDates.length > 0 ? (
          <div className="space-y-1.5">
            {sortedDates.map((date) => {
              const items = sessionsByDate[date];
              const isOpen = openDates.has(date);
              const dayFocus = items.filter((s) => s.type === 'work').length;
              const dayMin = Math.round(
                items.reduce((sum, s) => sum + s.duration, 0) / 60
              );
              return (
                <div
                  key={date}
                  className={cn(
                    'rounded-lg border border-border/50 bg-card/30 overflow-hidden transition-colors',
                    isOpen && 'border-border bg-card/50'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleDate(date)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0',
                          !isOpen && '-rotate-90'
                        )}
                      />
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-medium truncate">
                          {formatDateLabel(new Date(date))}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {format(new Date(date), 'MMM d, yyyy', { locale })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {tf('history.day.focusBadge', lang, { count: dayFocus })}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {dayMin}m
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3 pt-1">
                      <ul className="relative space-y-1 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border/60">
                        {items
                          .sort(
                            (a, b) =>
                              new Date(b.startTime).getTime() -
                              new Date(a.startTime).getTime()
                          )
                          .map((session) => {
                            const meta = TYPE_META[session.type];
                            const Icon = meta.Icon;
                            const min = Math.round(session.duration / 60);
                            return (
                              <li
                                key={session.id}
                                className="relative pl-6 py-1.5 group"
                              >
                                <span
                                  className={cn(
                                    'absolute left-0 top-2.5 h-3.5 w-3.5 rounded-full ring-2 ring-background flex items-center justify-center',
                                    meta.bg
                                  )}
                                >
                                  <span
                                    className={cn(
                                      'h-1.5 w-1.5 rounded-full',
                                      meta.dot
                                    )}
                                  />
                                </span>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Icon
                                      className={cn(
                                        'h-3.5 w-3.5 shrink-0',
                                        meta.text
                                      )}
                                    />
                                    <span className="text-sm font-medium">
                                      {t(meta.labelKey, lang)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      · {min} min
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                                    {format(new Date(session.startTime), 'p', { locale })}
                                  </span>
                                </div>
                                {session.notes && (
                                  <p className="text-xs text-muted-foreground/90 mt-1 leading-relaxed">
                                    {session.notes}
                                  </p>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState lang={lang} />
        )}
      </CardContent>
    </Card>
  );
};

const StatPill = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg bg-muted/30 border border-border/40">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-base font-semibold tabular-nums">{value}</span>
  </div>
);

const EmptyState = ({ lang }: { lang: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="h-12 w-12 rounded-full bg-muted/40 flex items-center justify-center mb-3">
      <Clock className="h-5 w-5 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium">{t('history.empty.title', lang)}</p>
    <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
      {t('history.empty.subtitle', lang)}
    </p>
  </div>
);

export default SessionHistory;
