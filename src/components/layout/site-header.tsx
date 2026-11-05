import Link from "next/link";
import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

/** Ruta provisional (página en blanco) a la que dirige VOTAR en este hito. */
export const VOTE_ROUTE = "/votar";

/**
 * Header fijo de la Página Principal: permanece visible durante todo el scroll.
 * Las medidas de escritorio (lg+) están expresadas en vw sobre el lienzo de
 * referencia de 1920px para conservar la proporción del diseño de Canva.
 *
 * VOTAR: Tiro Bangla tiene métricas verticales asimétricas; `pt-[0.2em]` compensa
 * el desfase para que la palabra quede centrada ópticamente (verificado midiendo
 * píxeles en capturas).
 *
 * Por debajo de lg: una sola fila con VOTAR siempre a la vista. En teléfono
 * vertical (< 640px) no cabe "¿Deseas votar?" junto al eslogan y se oculta: el
 * botón ya comunica la acción.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-(--header-h) bg-white font-tiro text-black max-lg:border-b max-lg:border-divider max-lg:pt-[env(safe-area-inset-top)]">
      <div className="flex h-full items-center justify-between gap-2 max-lg:px-(--page-x) sm:gap-4 lg:pr-[4.11vw] lg:pl-[3.82vw]">
        <div className="flex items-center gap-3 max-lg:min-w-0 max-sm:gap-2 lg:translate-y-[0.15vw] lg:gap-[0.71vw]">
          <div className="w-12 shrink-0 min-[360px]:w-14 sm:w-16 lg:w-[3.96vw]">
            <OwnerImage
              asset={ownerAssets.companyIcon}
              sizes="(min-width: 64rem) 4vw, 64px"
            />
          </div>
          <p className="text-base italic leading-tight max-sm:text-[clamp(0.8125rem,3.7vw,1rem)] md:max-lg:whitespace-nowrap lg:text-[max(0.875rem,1.25vw)]">
            Demuestra la pasión por tu equipo
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 max-lg:shrink-0 lg:gap-[1.07vw]">
          <p className="text-lg leading-none text-brand-blue max-sm:hidden max-lg:whitespace-nowrap lg:translate-y-[0.36vw] sm:text-xl lg:text-[1.71vw]">
            ¿Deseas votar?
          </p>
          <Link
            href={VOTE_ROUTE}
            className="inline-flex h-11 min-w-28 items-center max-sm:min-w-[5.5rem] max-sm:px-3 justify-center rounded-2xl border-[3px] border-brand-blue px-4 pt-[0.2em] text-lg leading-none text-brand-blue transition-colors hover:bg-brand-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:text-xl lg:h-[3.49vw] lg:w-[12.29vw] lg:rounded-[1.04vw] lg:border-[length:max(2px,0.156vw)] lg:text-[1.78vw]"
          >
            VOTAR
          </Link>
        </div>
      </div>
    </header>
  );
}
