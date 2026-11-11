import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";
import { AUTH_ROUTES } from "@/lib/auth/routes";

/**
 * Header fijo de la Página Principal, con el mismo estilo que el del login: barra
 * blanca translúcida con desenfoque, logo, eslogan en Montserrat y VOTAR como
 * píldora azul con flecha. Permanece visible durante todo el scroll. Alto en
 * --header-h: 60px por debajo de lg, 52px con el teléfono girado y 72px en lg+.
 *
 * El desenfoque va en una capa interna (`before`) y no en el header: un
 * `backdrop-filter` en el header convertiría a la cápsula del teléfono, que es
 * `fixed`, en relativa al header en vez de al viewport.
 *
 * Teléfono en vertical (phone): la barra queda con logo y eslogan, y
 * "¿Deseas votar?" + VOTAR pasan a una cápsula flotante centrada abajo, al alcance
 * del pulgar, con el mismo estilo de vidrio.
 *
 * Tablet, teléfono girado y lg+: una sola fila. Por debajo de 640px de ancho no
 * cabe "¿Deseas votar?" y se oculta (VOTAR sigue a la vista).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-(--header-h) border-b border-black/5 pt-[env(safe-area-inset-top)] font-montserrat text-black before:absolute before:inset-0 before:-z-10 before:bg-white/75 before:backdrop-blur-md lg:pt-0">
      <div className="flex h-full items-center justify-between gap-3 px-(--page-x) lg:px-[max(2.5rem,4vw)]">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:gap-5">
          <div className="aspect-[592/632] h-10 shrink-0 wide:h-9 tablet:h-11 lg:h-[clamp(3rem,3.5vw,3.5rem)]">
            <OwnerImage
              asset={ownerAssets.companyIcon}
              sizes="(min-width: 64rem) 56px, 44px"
            />
          </div>
          <p className="min-w-0 border-l border-black/10 pl-3 text-[0.6875rem] leading-tight font-semibold tracking-wide text-[#0b1f3f]/75 uppercase sm:pl-4 sm:text-xs lg:pl-5 lg:text-[0.8125rem]">
            Demuestra la pasión por tu equipo
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 phone:fixed phone:bottom-[max(0.75rem,env(safe-area-inset-bottom))] phone:left-1/2 phone:h-[3.25rem] phone:w-max phone:-translate-x-1/2 phone:gap-3 phone:rounded-full phone:border phone:border-black/10 phone:bg-white/80 phone:pr-1 phone:pl-4 phone:shadow-[0_0.75rem_1.75rem_rgba(29,58,115,0.22)] phone:backdrop-blur-md lg:gap-4">
          <p className="text-sm leading-none font-semibold whitespace-nowrap text-black/70 wide:max-sm:hidden tablet:max-sm:hidden">
            ¿Deseas votar?
          </p>
          <Link
            href={AUTH_ROUTES.login}
            className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-blue px-5 text-sm leading-none font-semibold tracking-wider text-white shadow-[0_0.5rem_1.25rem_rgba(21,78,142,0.28)] transition-[background-color,scale] after:absolute after:inset-x-0 after:-inset-y-1 hover:bg-[#0f3f75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue active:scale-95 motion-reduce:active:scale-100 phone:h-11 phone:after:hidden wide:h-9 wide:px-4"
          >
            VOTAR
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
