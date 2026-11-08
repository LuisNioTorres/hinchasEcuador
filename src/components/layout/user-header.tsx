import Link from "next/link";
import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

function initialsOf(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/**
 * Header del usuario logueado. Mismo estilo que el de la página principal
 * (src/components/layout/site-header.tsx): barra blanca translúcida con
 * desenfoque, logo y eslogan a la izquierda. A la derecha, el nombre del usuario en
 * lugar de VOTAR; en teléfono, solo su nombre de pila para que quepa.
 */
export function UserHeader({ fullName }: { fullName: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;
  return (
    <header className="sticky top-0 z-50 h-(--header-h) border-b border-black/5 pt-[env(safe-area-inset-top)] font-montserrat text-black before:absolute before:inset-0 before:-z-10 before:bg-white/75 before:backdrop-blur-md lg:pt-0">
      <div className="flex h-full items-center justify-between gap-3 px-(--page-x) lg:px-[max(2.5rem,4vw)]">
        <Link
          href="/"
          aria-label="Ir a la página principal"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-results-blue sm:gap-4 lg:gap-5"
        >
          <span className="w-[3.25rem] shrink-0 wide:w-12 tablet:w-[3.75rem] lg:w-[clamp(4.5rem,5.2vw,6rem)]">
            <OwnerImage
              asset={ownerAssets.companyIcon}
              sizes="(min-width: 64rem) 96px, 60px"
            />
          </span>
          <span className="min-w-0 border-l border-black/10 pl-3 text-[0.6875rem] leading-tight font-semibold tracking-wide text-[#0b1f3f]/75 uppercase sm:pl-4 sm:text-xs lg:pl-5 lg:text-[0.8125rem]">
            Demuestra la pasión por tu equipo
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-black/10 bg-white/80 py-1 pr-1 pl-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] max-sm:pl-1 wide:py-0.5">
          <span className="text-sm leading-none font-semibold whitespace-nowrap text-black/80 max-sm:hidden">
            {fullName}
          </span>
          <span className="sr-only sm:hidden">{fullName}</span>
          <span
            aria-hidden="true"
            title={fullName}
            className="flex size-8 items-center justify-center rounded-full bg-brand-blue text-xs font-bold tracking-wide text-white"
          >
            {initialsOf(fullName)}
          </span>
          <span
            aria-hidden="true"
            className="pr-2 text-sm leading-none font-semibold text-black/80 sm:hidden"
          >
            {firstName}
          </span>
        </div>
      </div>
    </header>
  );
}
