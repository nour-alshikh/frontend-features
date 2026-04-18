"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  loading = false,
  className,
}: SearchInputProps) {
  return (
    <div className={["relative flex items-center", className].filter(Boolean).join(" ")}>
      {/* Search icon */}
      <span className="absolute left-3 text-muted-foreground pointer-events-none">
        <SearchIcon />
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent transition-shadow"
      />

      {/* Right slot: spinner or clear */}
      <span className="absolute right-3 text-muted-foreground">
        {loading ? (
          <Spinner />
        ) : value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="hover:text-foreground transition-colors"
          >
            <XIcon />
          </button>
        ) : null}
      </span>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
