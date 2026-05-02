"use client";

import {
  useState, useEffect, useLayoutEffect, useRef, KeyboardEvent, ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS_SHORT  = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function isToday(d: Date) { return sameDay(d, new Date()); }

function buildGrid(year: number, month: number): Array<Date | null> {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function shiftMonth(base: Date, n: number) {
  return new Date(base.getFullYear(), base.getMonth() + n, 1);
}

function fmt(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  from: Date | null;
  to:   Date | null;
}

// ─── Shared Calendar UI ───────────────────────────────────────────────────────

interface CalendarProps {
  viewMonth:           Date;
  onViewMonthChange:   (d: Date) => void;
  onSelect:            (d: Date) => void;
  isSelected:          (d: Date) => boolean;
  isInRange?:          (d: Date) => boolean;
  isRangeEdge?:        (d: Date) => boolean;
  onHover?:            (d: Date | null) => void;
  min?:                Date;
  max?:                Date;
  focusedDate:         Date;
  onFocusedDateChange: (d: Date) => void;
}

function Calendar({
  viewMonth, onViewMonthChange,
  onSelect,
  isSelected, isInRange, isRangeEdge,
  onHover,
  min, max,
  focusedDate, onFocusedDateChange,
}: CalendarProps) {
  const y    = viewMonth.getFullYear();
  const m    = viewMonth.getMonth();
  const grid = buildGrid(y, m);

  const isDisabled = (d: Date) =>
    (min != null && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) ||
    (max != null && d > new Date(max.getFullYear(), max.getMonth(), max.getDate()));

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const fd = focusedDate;
    let next: Date | null = null;

    if      (e.key === "ArrowRight") next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 1);
    else if (e.key === "ArrowLeft")  next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() - 1);
    else if (e.key === "ArrowDown")  next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 7);
    else if (e.key === "ArrowUp")    next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() - 7);
    else if (e.key === "PageDown")   { e.preventDefault(); onViewMonthChange(shiftMonth(viewMonth, 1));  return; }
    else if (e.key === "PageUp")     { e.preventDefault(); onViewMonthChange(shiftMonth(viewMonth, -1)); return; }
    else if (e.key === "Enter" || e.key === " ") {
      if (!isDisabled(fd)) { e.preventDefault(); onSelect(fd); }
      return;
    }

    if (!next) return;
    e.preventDefault();
    onFocusedDateChange(next);
    if (next.getMonth() !== m || next.getFullYear() !== y) {
      onViewMonthChange(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => onHover?.(null)}
      className="outline-none"
      aria-label={`${MONTH_NAMES[m]} ${y}`}
      role="grid"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => onViewMonthChange(shiftMonth(viewMonth, -1))}
          aria-label="Previous month"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon />
        </button>
        <p className="text-sm font-semibold text-foreground select-none">
          {MONTH_NAMES[m]} {y}
        </p>
        <button
          type="button"
          onClick={() => onViewMonthChange(shiftMonth(viewMonth, 1))}
          aria-label="Next month"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1" role="row">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            role="columnheader"
            aria-label={d}
            className="h-8 flex items-center justify-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7" role="rowgroup">
        {grid.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} role="gridcell" />;

          const sel     = isSelected(day);
          const inRange = isInRange?.(day) ?? false;
          const edge    = isRangeEdge?.(day) ?? false;
          const today   = isToday(day);
          const dis     = isDisabled(day);
          const focused = sameDay(day, focusedDate) && day.getMonth() === m;

          return (
            <button
              key={`d-${i}`}
              type="button"
              role="gridcell"
              disabled={dis}
              onClick={() => !dis && onSelect(day)}
              onMouseEnter={() => { if (!dis) { onFocusedDateChange(day); onHover?.(day); } }}
              aria-label={day.toDateString()}
              aria-pressed={sel}
              aria-current={today ? "date" : undefined}
              className={[
                "h-8 w-full flex items-center justify-center text-sm transition-colors relative select-none",
                dis ? "opacity-25 cursor-not-allowed" : "cursor-pointer",
                (sel || edge) ? "bg-accent text-accent-foreground font-semibold rounded-lg z-10" : "",
                inRange && !sel && !edge ? "bg-accent/15 text-foreground rounded-none" : "",
                !sel && !inRange && !edge && !dis ? "hover:bg-surface text-foreground rounded-lg" : "",
                today && !sel && !edge ? "ring-1 ring-inset ring-accent rounded-lg" : "",
                focused && !sel && !edge ? "outline outline-2 outline-accent/50 rounded-lg" : "",
              ].filter(Boolean).join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Popup panel (portal + positioning) ──────────────────────────────────────

const GAP = 6;

function getPopupPos(
  anchor: DOMRect,
  popupWidth: number,
  popupHeight: number,
): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top  = anchor.bottom + GAP;
  let left = anchor.left;
  if (left + popupWidth  > vw - 4) left = Math.max(4, vw - popupWidth - 4);
  if (top  + popupHeight > vh - 4) top  = anchor.top - popupHeight - GAP;
  return { top, left };
}

function PopupPanel({
  anchorRef,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchorRef.current || !panelRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    setPos(getPopupPos(anchor, panelRef.current.offsetWidth, panelRef.current.offsetHeight));
  });

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (
        !anchorRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [anchorRef, onClose]);

  useEffect(() => {
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      style={{
        position: "fixed",
        top:  pos ? pos.top  : -9999,
        left: pos ? pos.left : -9999,
        zIndex: 9999,
      }}
      className={[
        "bg-background border border-border rounded-xl shadow-xl p-4 w-72",
        pos ? "animate-[fade-in_0.12s_ease-out]" : "",
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>,
    document.body,
  );
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

export interface DatePickerProps {
  value:       Date | null;
  onChange:    (date: Date | null) => void;
  placeholder?: string;
  disabled?:   boolean;
  min?:        Date;
  max?:        Date;
  className?:  string;
}

export function DatePicker({
  value, onChange,
  placeholder = "Pick a date…",
  disabled, min, max, className,
}: DatePickerProps) {
  const [open, setOpen]             = useState(false);
  const [viewMonth, setViewMonth]   = useState(() => value ?? new Date());
  const [focusedDate, setFocused]   = useState(() => value ?? new Date());
  const [mounted, setMounted]       = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null!);

  useEffect(() => { setMounted(true); }, []);

  const open_ = () => {
    const anchor = value ?? new Date();
    setViewMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    setFocused(anchor);
    setOpen(true);
  };

  return (
    <div ref={anchorRef} className={["inline-block", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : open_())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm w-56 transition-colors",
          open ? "border-accent ring-2 ring-accent/20" : "border-border",
          "bg-background",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-accent/60 cursor-pointer",
        ].join(" ")}
      >
        <CalendarIcon />
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? fmt(value) : placeholder}
        </span>
      </button>

      {mounted && open && (
        <PopupPanel anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <Calendar
            viewMonth={viewMonth}
            onViewMonthChange={setViewMonth}
            onSelect={(d) => { onChange(d); setOpen(false); }}
            isSelected={(d) => !!value && sameDay(d, value)}
            min={min}
            max={max}
            focusedDate={focusedDate}
            onFocusedDateChange={setFocused}
          />
          {value && (
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="mt-3 w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </PopupPanel>
      )}
    </div>
  );
}

// ─── DateRangePicker ──────────────────────────────────────────────────────────

export interface DateRangePickerProps {
  value:       DateRange;
  onChange:    (range: DateRange) => void;
  placeholder?: string;
  disabled?:   boolean;
  min?:        Date;
  max?:        Date;
  className?:  string;
}

export function DateRangePicker({
  value, onChange,
  placeholder = "Pick a range…",
  disabled, min, max, className,
}: DateRangePickerProps) {
  const [open, setOpen]           = useState(false);
  const [viewMonth, setViewMonth] = useState(() => value.from ?? new Date());
  const [focusedDate, setFocused] = useState(() => value.from ?? new Date());
  const [hovered, setHovered]     = useState<Date | null>(null);
  const [mounted, setMounted]     = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null!);

  useEffect(() => { setMounted(true); }, []);

  const open_ = () => {
    const anchor = value.from ?? new Date();
    setViewMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    setFocused(anchor);
    setOpen(true);
  };

  const handleSelect = (d: Date) => {
    if (!value.from || (value.from && value.to)) {
      onChange({ from: d, to: null });
    } else {
      const [from, to] = d < value.from ? [d, value.from] : [value.from, d];
      onChange({ from, to });
      setOpen(false);
    }
  };

  const isSelected = (d: Date) =>
    (!!value.from && sameDay(d, value.from)) || (!!value.to && sameDay(d, value.to));

  const isRangeEdge = isSelected;

  const isInRange = (d: Date) => {
    const end = value.to ?? hovered;
    if (!value.from || !end) return false;
    const [lo, hi] = value.from <= end ? [value.from, end] : [end, value.from];
    return d > lo && d < hi;
  };

  const displayText = () => {
    if (!value.from) return placeholder;
    if (!value.to)   return `${fmt(value.from)} → …`;
    return `${fmt(value.from)} – ${fmt(value.to)}`;
  };

  return (
    <div ref={anchorRef} className={["inline-block", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : open_())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors",
          value.from ? "w-80" : "w-56",
          open ? "border-accent ring-2 ring-accent/20" : "border-border",
          "bg-background",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-accent/60 cursor-pointer",
        ].join(" ")}
      >
        <CalendarIcon />
        <span className={value.from ? "text-foreground" : "text-muted-foreground"}>
          {displayText()}
        </span>
      </button>

      {mounted && open && (
        <PopupPanel anchorRef={anchorRef} onClose={() => setOpen(false)}>
          <Calendar
            viewMonth={viewMonth}
            onViewMonthChange={setViewMonth}
            onSelect={handleSelect}
            isSelected={isSelected}
            isInRange={isInRange}
            isRangeEdge={isRangeEdge}
            onHover={setHovered}
            min={min}
            max={max}
            focusedDate={focusedDate}
            onFocusedDateChange={setFocused}
          />
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            {!value.from
              ? "Click to set start date"
              : !value.to
              ? "Click to set end date"
              : "Click to pick a new range"}
          </p>
          {value.from && (
            <button
              type="button"
              onClick={() => onChange({ from: null, to: null })}
              className="mt-1 w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </PopupPanel>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8"  x2="8"  y1="2" y2="6" />
      <line x1="3"  x2="21" y1="10" y2="10" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
