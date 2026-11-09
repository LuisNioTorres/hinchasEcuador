"use client";

import Link from "next/link";
import { useEditedName } from "@/lib/auth/simulated-profile";

function initialsOf(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/**
 * Nombre del usuario a la derecha del header; lleva a su información. En teléfono
 * muestra solo el nombre de pila para que quepa.
 */
export function UserChip({ fullName: initialName }: { fullName: string }) {
  const edited = useEditedName();
  const fullName = edited
    ? `${edited.firstName} ${edited.lastName}`
    : initialName;
  const firstName = edited?.firstName ?? fullName.trim().split(/\s+/)[0];

  return (
    <Link
      href="/user-info"
      aria-label={`Ver mi información: ${fullName}`}
      className="flex max-w-[50vw] shrink-0 items-center gap-2.5 rounded-full border border-black/10 bg-white/80 py-1 pr-1 pl-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue max-sm:pl-1 wide:py-0.5"
    >
      <span className="truncate text-sm leading-none font-semibold whitespace-nowrap text-black/80 max-sm:hidden">
        {fullName}
      </span>
      <span
        aria-hidden="true"
        title={fullName}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold tracking-wide text-white"
      >
        {initialsOf(fullName)}
      </span>
      <span
        aria-hidden="true"
        className="truncate pr-2 text-sm leading-none font-semibold text-black/80 sm:hidden"
      >
        {firstName}
      </span>
    </Link>
  );
}
