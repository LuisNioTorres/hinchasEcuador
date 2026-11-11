import Link from "next/link";
import { ownerAssets } from "@/config/owner-assets";
import { UserChip } from "@/components/layout/user-chip";
import { OwnerImage } from "@/components/ui/owner-image";

/**
 * Header del usuario logueado. Mismo estilo que el de la página principal
 * (src/components/layout/site-header.tsx): barra blanca translúcida con
 * desenfoque, logo y eslogan a la izquierda. A la derecha, el nombre del usuario en
 * lugar de VOTAR, que lleva a su información.
 */
export function UserHeader({ fullName }: { fullName: string }) {
  return (
    <header className="sticky top-0 z-50 h-(--header-h) border-b border-black/5 pt-[env(safe-area-inset-top)] font-montserrat text-black before:absolute before:inset-0 before:-z-10 before:bg-white/75 before:backdrop-blur-md lg:pt-0">
      <div className="flex h-full items-center justify-between gap-3 px-(--page-x) lg:px-[max(2.5rem,4vw)]">
        <Link
          href="/"
          aria-label="Ir a la página principal"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-results-blue sm:gap-4 lg:gap-5"
        >
          <span className="aspect-[592/632] h-10 shrink-0 wide:h-9 tablet:h-11 lg:h-[clamp(3rem,3.5vw,3.5rem)]">
            <OwnerImage
              asset={ownerAssets.companyIcon}
              sizes="(min-width: 64rem) 56px, 44px"
            />
          </span>
          <span className="min-w-0 border-l border-black/10 pl-3 text-[0.6875rem] leading-tight font-semibold tracking-wide text-[#0b1f3f]/75 uppercase sm:pl-4 sm:text-xs lg:pl-5 lg:text-[0.8125rem]">
            Demuestra la pasión por tu equipo
          </span>
        </Link>

        <UserChip fullName={fullName} />
      </div>
    </header>
  );
}
