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
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-(--header-h) bg-white font-tiro text-black">
      <div className="flex h-full flex-col justify-center gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 lg:pr-[4.11vw] lg:pl-[3.82vw]">
        <div className="flex items-center gap-3 lg:translate-y-[0.15vw] lg:gap-[0.71vw]">
          <div className="w-11 shrink-0 lg:w-[3.96vw]">
            <OwnerImage
              asset={ownerAssets.companyIcon}
              sizes="(min-width: 64rem) 4vw, 44px"
            />
          </div>
          <p className="text-base italic leading-tight lg:text-[max(0.875rem,1.25vw)]">
            Demuestra la pasión por tu equipo
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 lg:gap-[1.07vw]">
          <p className="text-lg leading-none text-brand-blue lg:translate-y-[0.36vw] sm:text-xl lg:text-[1.71vw]">
            ¿Deseas votar?
          </p>
          <Link
            href={VOTE_ROUTE}
            className="inline-flex h-11 min-w-28 items-center justify-center rounded-2xl border-[3px] border-brand-blue px-4 pt-[0.2em] text-lg leading-none text-brand-blue transition-colors hover:bg-brand-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:text-xl lg:h-[3.49vw] lg:w-[12.29vw] lg:rounded-[1.04vw] lg:border-[length:max(2px,0.156vw)] lg:text-[1.78vw]"
          >
            VOTAR
          </Link>
        </div>
      </div>
    </header>
  );
}
