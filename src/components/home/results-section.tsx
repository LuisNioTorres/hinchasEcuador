import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";
import { TopFiveList } from "@/components/home/results/top-five-list";
import { ResultsState } from "@/components/home/results/results-state";
import type { NationalResultsResponse } from "@/mocks/national-results";

interface ResultsSectionProps {
  results: NationalResultsResponse;
}

/**
 * Sección 2 — Resultados nacionales (solo versión desktop por ahora).
 * Referencia: design/references/pagina-principal/PAG PRINCIPAL 2.jpg
 *
 * Medidas lg+ en vw sobre el lienzo de 1920px, tomando como origen vertical
 * la línea separadora de la referencia (y=110). Tipografía: Montserrat.
 *
 * El mapa es un marcador provisional hasta definir la geometría interactiva
 * por provincias (ver informe). El TOP 5 no tiene interacción todavía: la
 * selección de club se implementará junto con el mapa interactivo.
 */
export function ResultsSection({ results }: ResultsSectionProps) {
  const { status, data } = results;
  const isOk = status === "ok" && data !== null;

  return (
    <section
      id="resultados-nacionales"
      aria-labelledby="resultados-title"
      className="bg-bone px-4 py-10 font-montserrat text-black lg:min-h-[calc(100svh-var(--header-h)-1px)] lg:p-0 lg:pt-[0.68vw]"
    >
      <h2
        id="resultados-title"
        className="mx-auto flex w-fit items-center justify-center rounded-xl border-2 border-black bg-results-blue px-6 py-3 text-center text-2xl leading-[1.4] font-semibold text-white lg:h-[6.56vw] lg:w-[22.92vw] lg:rounded-[0.63vw] lg:border-[length:max(2px,0.1vw)] lg:p-0 lg:text-[1.93vw]"
      >
        RESULTADOS
        <br />
        NACIONALES
      </h2>

      <div className="mt-10 flex flex-col gap-10 lg:mt-0 lg:flex-row lg:items-start lg:gap-0">
        <div className="lg:mt-[3.07vw] lg:ml-[11.98vw] lg:w-[29.43vw] lg:shrink-0">
          <OwnerImage
            asset={ownerAssets.ecuadorProvinceMap}
            showPlaceholderLabel
          />
        </div>

        <div className="lg:mt-[2.76vw] lg:ml-[15.36vw] lg:w-[30.63vw] lg:shrink-0">
          <div className="flex flex-wrap items-center gap-6 lg:flex-nowrap lg:gap-0">
            <p className="ml-3 flex h-12 w-36 -skew-x-[21deg] items-center justify-center rounded-xl border-4 border-black bg-white lg:ml-[0.78vw] lg:h-[3.54vw] lg:w-[9.9vw] lg:rounded-[0.63vw] lg:border-[length:max(3px,0.21vw)]">
              <span className="skew-x-[21deg] text-2xl leading-none font-bold lg:text-[1.93vw]">
                TOP 5
              </span>
            </p>
            {isOk && (
              <p className="text-lg leading-none font-semibold lg:ml-[2.55vw] lg:text-[1.4vw] lg:whitespace-nowrap">
                {data.totalFans} hinchas censados
              </p>
            )}
          </div>

          <div className="mt-6 lg:mt-[1.35vw]">
            {isOk ? (
              <TopFiveList clubs={data.top} />
            ) : (
              <ResultsState status={status === "ok" ? "error" : status} />
            )}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-base leading-none italic lg:mt-[2.97vw] lg:text-[1.34vw]">
        Proximamente, se podrán ver los resultados por provincia
      </p>
    </section>
  );
}
