import Link from "next/link";
import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

/** Ruta provisional (página en blanco) a la que dirige VOTAR en este hito. */
export const VOTE_ROUTE = "/votar";

/**
 * Header fijo de la Página Principal: permanece visible durante todo el scroll.
 * Mide 45px en todas las pantallas (--header-h), con logo y textos de tamaño fijo.
 *
 * VOTAR: Tiro Bangla tiene métricas verticales asimétricas; `pt-[0.2em]` compensa
 * el desfase para que la palabra quede centrada ópticamente (verificado midiendo
 * píxeles en capturas).
 *
 * Teléfono en vertical (phone): el header queda solo con logo y eslogan, y
 * "¿Deseas votar?" + VOTAR pasan a una cápsula flotante compacta, centrada y al alcance del pulgar,
 * y con el botón relleno para que sea la acción dominante. Es `fixed` dentro del
 * header sticky: el header no debe tener transform ni filter, o dejaría de
 * anclarse al viewport.
 *
 * Tablet y lg+: una sola fila, con el mismo VOTAR relleno y redondo. El botón mide
 * 36px de alto para caber en el header; `after` amplía su zona táctil a 44px.
 *
 * Horizontal: una sola fila con VOTAR siempre a la vista. Por debajo de 640px no
 * cabe "¿Deseas votar?" y se oculta.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-(--header-h) border-b border-divider bg-white font-tiro text-black max-lg:pt-[env(safe-area-inset-top)]">
      <div className="flex h-full items-center justify-between gap-2 max-lg:px-(--page-x) sm:gap-4 lg:pr-[4.11vw] lg:pl-[3.82vw]">
        <div className="flex items-center gap-3 max-lg:min-w-0 max-sm:gap-2">
          <div className="w-10 shrink-0 min-[360px]:w-[2.875rem]">
            <OwnerImage asset={ownerAssets.companyIcon} sizes="46px" />
          </div>
          <p className="text-[0.9375rem] italic leading-tight max-sm:text-[clamp(0.8125rem,3.7vw,0.9375rem)] md:max-lg:whitespace-nowrap phone:text-[clamp(0.8125rem,3.8vw,0.9375rem)] phone:whitespace-nowrap min-[45.375rem]:tablet:whitespace-nowrap">
            Demuestra la pasión por tu equipo
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 max-lg:shrink-0 phone:fixed phone:bottom-[max(0.75rem,env(safe-area-inset-bottom))] phone:left-1/2 phone:h-[3.25rem] phone:w-max phone:-translate-x-1/2 phone:gap-2.5 phone:rounded-full phone:border phone:border-black/10 phone:bg-white phone:pr-1 phone:pl-4 phone:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
          <p className="text-lg leading-none text-brand-blue wide:max-sm:hidden tablet:max-sm:hidden max-lg:whitespace-nowrap phone:text-base">
            ¿Deseas votar?
          </p>
          <Link
            href={VOTE_ROUTE}
            className="relative inline-flex h-9 min-w-28 items-center max-sm:min-w-[5.5rem] max-sm:px-3 justify-center rounded-2xl border-[3px] border-brand-blue px-4 pt-[0.2em] text-lg leading-none text-brand-blue transition-colors after:absolute after:inset-x-0 after:-inset-y-1 hover:bg-brand-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue phone:h-11 phone:after:hidden phone:min-w-[6.5rem] phone:rounded-full phone:bg-brand-blue phone:text-lg phone:tracking-wide phone:text-white phone:transition-transform phone:hover:bg-brand-blue phone:active:scale-95 tablet:min-w-[7.5rem] tablet:rounded-full tablet:bg-brand-blue tablet:tracking-wide tablet:text-white tablet:transition-transform tablet:hover:bg-brand-blue tablet:active:scale-95 lg:min-w-[7.5rem] lg:rounded-full lg:bg-brand-blue lg:tracking-wide lg:text-white lg:transition-transform lg:hover:bg-brand-blue lg:active:scale-95"
          >
            VOTAR
          </Link>
        </div>
      </div>
    </header>
  );
}
