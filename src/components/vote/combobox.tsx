"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { FIELD_LABEL, FieldError } from "@/components/login/auth-ui";
import { searchOptions } from "@/lib/search";

export interface ComboboxOption {
  readonly id: string;
  readonly label: string;
  /** Texto secundario, también se usa en la búsqueda (p. ej., nombre oficial). */
  readonly hint?: string;
  readonly leading?: ReactNode;
}

/**
 * Buscador con lista desplegable (patrón combobox de WAI-ARIA 1.2): se escribe para
 * filtrar, sin importar tildes ni mayúsculas, y se elige con el ratón, el dedo o
 * el teclado (flechas, Enter, Escape).
 */
export function Combobox({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  disabledPlaceholder,
  error,
  emptyText,
  icon = <Search aria-hidden="true" />,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: readonly ComboboxOption[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
  error?: string;
  emptyText: string;
  icon?: ReactNode;
}) {
  const listId = useId();
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = options.find((o) => o.id === value) ?? null;
  const results = useMemo(
    () => searchOptions(options, query, (o) => [o.label, o.hint ?? ""]),
    [options, query],
  );

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setQuery("");
    const index = selected ? options.indexOf(selected) : 0;
    setActive(Math.max(index, 0));
    setOpen(true);
  };

  const choose = (option: ComboboxOption) => {
    onChange(option.id);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return openList();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive(
        (i) => (i + step + results.length) % Math.max(results.length, 1),
      );
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = results[active];
      if (option) choose(option);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };

  const activeOption = open ? results[active] : undefined;

  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 flex -translate-y-1/2 text-black/35 [&>svg]:size-[1.125rem]">
          {selected && !open && selected.leading ? selected.leading : icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={disabled}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeOption ? `${listId}-${activeOption.id}` : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder={
            disabled
              ? (disabledPlaceholder ?? placeholder)
              : open && selected
                ? selected.label
                : placeholder
          }
          value={open ? query : (selected?.label ?? "")}
          onFocus={openList}
          onClick={() => !open && openList()}
          onBlur={() => {
            setOpen(false);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`h-12 w-full rounded-xl border bg-white pr-11 pl-12 text-[0.9375rem] text-black transition-[border-color,box-shadow] outline-none placeholder:text-black/40 focus:ring-4 disabled:cursor-not-allowed disabled:bg-[#f4f6fa] disabled:placeholder:text-black/35 ${
            selected && !open ? "font-semibold" : ""
          } ${
            error
              ? "border-[#d92d20] focus:ring-[#d92d20]/15"
              : "border-black/15 focus:border-results-blue focus:ring-results-blue/15"
          }`}
        />
        <ChevronDown
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 right-4 size-[1.125rem] -translate-y-1/2 text-black/40 transition-transform motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          hidden={!open}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(18rem,45svh)] overflow-y-auto overscroll-contain rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_1.25rem_2.5rem_rgba(29,58,115,0.18)]"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-black/55">{emptyText}</li>
          ) : (
            results.map((option, index) => {
              const isSelected = option.id === value;
              return (
                <li
                  key={option.id}
                  id={`${listId}-${option.id}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  // Evita que el input pierda el foco antes de elegir.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseMove={() => index !== active && setActive(index)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] ${
                    index === active ? "bg-[#eef4fd]" : ""
                  }`}
                >
                  {option.leading}
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate ${isSelected ? "font-semibold text-results-blue" : "text-black"}`}
                    >
                      {option.label}
                    </span>
                    {option.hint && (
                      <span className="block truncate text-xs text-black/45">
                        {option.hint}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-results-blue"
                    />
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
