import { useState, useRef, useEffect } from "react";

type Faculty = { id: number; name: string };

type CoAuthorSelectProps = {
  /** All available faculty options */
  options: Faculty[];
  /** Currently selected user IDs */
  value: number[];
  /** Called when the selection changes */
  onChange: (ids: number[]) => void;
  /** The currently logged-in user's ID — always selected and cannot be removed */
  currentUserId: number;
  /** Custom label for the placeholder text */
  label?: string;
};

const CoAuthorSelect = ({
  options,
  value,
  onChange,
  currentUserId,
  label = "co-author(s)",
}: CoAuthorSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: number) => {
    // Current user cannot be deselected
    if (id === currentUserId) return;
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeChip = (id: number) => {
    if (id === currentUserId) return;
    onChange(value.filter((v) => v !== id));
  };

  const selectedNames = value.map((id) => {
    const f = options.find((o) => o.id === id);
    return f ? { id, name: f.name } : null;
  }).filter(Boolean) as { id: number; name: string }[];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected chips */}
      <div
        className="flex min-h-[2.25rem] w-full cursor-pointer flex-wrap gap-1 rounded-md border border-gray-800 bg-white p-1"
        onClick={() => setIsOpen((o) => !o)}
      >
        {selectedNames.length === 0 && (
          <span className="px-1 py-0.5 text-sm text-gray-400">
            Select {label}…
          </span>
        )}
        {selectedNames.map(({ id, name }) => (
          <span
            key={id}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium bg-white ${
              id === currentUserId 
                ? "border-black text-black" 
                : "border-black text-black"
            }`}
          >
            {name}
            {id !== currentUserId && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeChip(id); }}
                className="ml-0.5 text-black/80 hover:text-red"
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="sticky top-0 bg-white p-2">
            <input
              autoFocus
              type="text"
              placeholder="Search faculty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400">No results found</p>
          ) : (
            filtered.map((f) => {
              const isSelected = value.includes(f.id);
              const isSelf = f.id === currentUserId;
              return (
                <div
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${
                    isSelf ? "cursor-default opacity-70" : ""
                  }`}
                >
                  <span className={isSelected ? "font-semibold text-indigo-600" : ""}>
                    {f.name}
                    {isSelf && (
                      <span className="ml-1 text-xs text-gray-400">(You)</span>
                    )}
                  </span>
                  {isSelected && (
                    <svg className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CoAuthorSelect;
