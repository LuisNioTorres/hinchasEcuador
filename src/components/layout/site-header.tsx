import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

/** Ruta provisional (página en blanco) a la que dirige VOTAR en este hito. */
export const VOTE_ROUTE = "/votar";

/**
 * Header fijo de la Página Principal: permanece visible durante todo el scroll.
 * Mide 45px por debajo de lg y 72px en lg+ (--header-h).
 *
 * VOTAR: Tiro Bangla tiene métricas verticales asimétricas; `pt-[0.2em]` compensa
 * el desfase para que la palabra quede centrada ópticamente (verificado midiendo
 * píxeles en capturas).
 *
 * Teléfono en vertical (phone): el header queda solo con logo y eslogan, y
 * "¿Deseas votar?" + VOTAR pasan a una cápsula flotante compacta, centrada y al alcance del pulgar,
 * y con el botón relleno para que sea la acción dominante. Es `fixed` dentro del
 * header sticky: el header no debe tener transform ni filter, o dejaría de
 * anclarse al viewport (el `backdrop-blur` solo se aplica en lg+, donde la cápsula
 * no existe).
 *
 * Tablet: una sola fila, con VOTAR relleno y redondo. El botón mide 36px de alto
 * para caber en el header; `after` amplía su zona táctil a 44px.
 *
 * lg+ (PROPUESTA en revisión): mismo estilo que el header del login. Barra
 * translúcida con desenfoque, logo más grande, eslogan en Montserrat y VOTAR como
 * píldora azul con flecha, a juego con "Volver al inicio".
 *
 * Horizontal: una sola fila con VOTAR siempre a la vista. Por debajo de 640px no
 * cabe "¿Deseas votar?" y se oculta.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-(--header-h) border-b border-divider bg-white font-tiro text-black max-lg:pt-[env(safe-area-inset-top)] lg:border-black/5 lg:bg-white/75 lg:font-montserrat lg:backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-2 max-lg:px-(--page-x) sm:gap-4 lg:px-[max(2.5rem,4vw)]">
        <div className="flex items-center gap-3 max-lg:min-w-0 max-sm:gap-2 lg:gap-5">
          <div className="w-10 shrink-0 min-[360px]:w-[2.875rem] lg:w-[clamp(4.5rem,5.2vw,6rem)]">
            <OwnerImage
              asset={ownerAssets.companyIcon}
              sizes="(min-width: 64rem) 96px, 46px"
            />
          </div>
          <p className="text-[0.9375rem] italic leading-tight max-sm:text-[clamp(0.8125rem,3.7vw,0.9375rem)] md:max-lg:whitespace-nowrap phone:text-[clamp(0.8125rem,3.8vw,0.9375rem)] phone:whitespace-nowrap min-[45.375rem]:tablet:whitespace-nowrap lg:border-l lg:border-black/10 lg:pl-5 lg:text-[0.8125rem] lg:font-semibold lg:tracking-wide lg:text-[#0b1f3f]/75 lg:uppercase lg:not-italic">
            Demuestra la pasión por tu equipo
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 max-lg:shrink-0 phone:fixed phone:bottom-[max(0.75rem,env(safe-area-inset-bottom))] phone:left-1/2 phone:h-[3.25rem] phone:w-max phone:-translate-x-1/2 phone:gap-2.5 phone:rounded-full phone:border phone:border-black/10 phone:bg-white phone:pr-1 phone:pl-4 phone:shadow-[0_6px_20px_rgba(0,0,0,0.2)] lg:gap-4">
          <p className="text-lg leading-none text-brand-blue wide:max-sm:hidden tablet:max-sm:hidden max-lg:whitespace-nowrap phone:text-base lg:text-sm lg:font-semibold lg:text-black/70">
            ¿Deseas votar?
          </p>
          <Link
            href={VOTE_ROUTE}
            className="group relative inline-flex h-9 min-w-28 items-center max-sm:min-w-[5.5rem] max-sm:px-3 justify-center rounded-2xl border-[3px] border-brand-blue px-4 pt-[0.2em] text-lg leading-none text-brand-blue transition-colors after:absolute after:inset-x-0 after:-inset-y-1 hover:bg-brand-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue phone:h-11 phone:after:hidden phone:min-w-[6.5rem] phone:rounded-full phone:bg-brand-blue phone:text-lg phone:tracking-wide phone:text-white phone:transition-transform phone:hover:bg-brand-blue phone:active:scale-95 tablet:min-w-[7.5rem] tablet:rounded-full tablet:bg-brand-blue tablet:tracking-wide tablet:text-white tablet:transition-transform tablet:hover:bg-brand-blue tablet:active:scale-95 lg:h-10 lg:min-w-0 lg:gap-2 lg:rounded-full lg:border-0 lg:bg-brand-blue lg:px-5 lg:pt-0 lg:text-sm lg:font-semibold lg:tracking-wider lg:text-white lg:shadow-[0_0.5rem_1.25rem_rgba(21,78,142,0.28)] lg:transition-[background-color,scale] lg:hover:bg-[#0f3f75] lg:focus-visible:outline-results-blue lg:active:scale-95 motion-reduce:lg:active:scale-100"
          >
            VOTAR
            <ArrowRight
              aria-hidden="true"
              className="hidden size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none lg:block"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
