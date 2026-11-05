import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";
import { TopFiveList } from "@/components/home/results/top-five-list";
import { ResultsState } from "@/components/home/results/results-state";
import type { NationalResultsResponse } from "@/mocks/national-results";

interface ResultsSectionProps {
  results: NationalResultsResponse;
}

/**
 * Sección 2 — Resultados nacionales.
 * Referencia: design/references/pagina-principal/PAG PRINCIPAL 2.jpg
 *
 * Medidas lg+ en vw sobre el lienzo de 1920px, tomando como origen vertical
 * la línea separadora de la referencia (y=110). Tipografía: Montserrat.
 *
 * Por debajo de lg:
 * - phone: TOP 5 compacto y, debajo, el mapa como protagonista a todo el ancho, sin
 *   pasar del alto visible para que se vea entero. "Proximamente…" es una nota
 *   pequeña al pie del mapa.
 * - tablet y wide: mapa a la izquierda y TOP 5 a la derecha, como en desktop.
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
      className="bg-bone py-10 font-montserrat text-black max-lg:px-(--page-x) phone:py-4 tablet:py-12 wide:py-8 lg:min-h-[calc(100svh-var(--header-h)-1px)] lg:p-0 lg:pt-[0.68vw]"
    >
      <h2
        id="resultados-title"
        className="mx-auto flex w-fit items-center justify-center rounded-xl border-2 border-black bg-results-blue px-6 py-3 text-center text-2xl leading-[1.4] font-semibold text-white phone:h-11 phone:w-full phone:rounded-lg phone:border phone:border-black/40 phone:px-3 phone:py-0 phone:text-[clamp(1rem,4.9vw,1.5rem)] phone:leading-[1.25] phone:font-bold tablet:px-10 tablet:text-[1.75rem] wide:px-8 wide:py-2 wide:text-[clamp(1.25rem,2.6vw,1.75rem)] lg:h-[6.56vw] lg:w-[22.92vw] lg:rounded-[0.63vw] lg:border-[length:max(2px,0.1vw)] lg:p-0 lg:text-[1.93vw]"
      >
        RESULTADOS <br className="phone:hidden" />
        NACIONALES
      </h2>

      <div className="mt-10 flex flex-col gap-10 phone:mt-2.5 phone:gap-3 tablet:flex-row tablet:items-center tablet:gap-[5vw] wide:mt-6 wide:flex-row wide:items-center wide:gap-[5vw] lg:mt-0 lg:flex-row lg:items-start lg:gap-0">
        <div className="phone:order-last phone:mx-auto phone:w-[min(100%,calc((100svh-var(--header-h)-var(--action-h)-3rem)*0.8787))] tablet:w-[42%] tablet:shrink-0 wide:w-[36%] wide:shrink-0 lg:mt-[3.07vw] lg:ml-[11.98vw] lg:w-[29.43vw] lg:shrink-0">
          <OwnerImage
            asset={ownerAssets.ecuadorProvinceMap}
            showPlaceholderLabel
          />
        </div>

        <div className="tablet:min-w-0 tablet:flex-1 wide:min-w-0 wide:flex-1 lg:mt-[2.76vw] lg:ml-[15.36vw] lg:w-[30.63vw] lg:shrink-0">
          <div className="flex items-center gap-6 max-lg:justify-between max-lg:gap-3 lg:gap-0">
            <p className="ml-3 flex h-12 w-36 -skew-x-[21deg] max-lg:shrink-0 phone:ml-2 phone:h-8 phone:w-[5.5rem] phone:rounded-md phone:border-2 tablet:w-[clamp(7.5rem,14vw,9rem)] wide:h-11 wide:w-[clamp(7.5rem,14vw,9rem)] items-center justify-center rounded-xl border-4 border-black bg-white lg:ml-[0.78vw] lg:h-[3.54vw] lg:w-[9.9vw] lg:rounded-[0.63vw] lg:border-[length:max(3px,0.21vw)]">
              <span className="skew-x-[21deg] text-2xl leading-none font-bold phone:text-[1.0625rem] lg:text-[1.93vw]">
                TOP 5
              </span>
            </p>
            {isOk && (
              <p className="text-lg leading-none font-semibold max-lg:text-right max-lg:leading-tight max-lg:text-balance phone:text-[0.9375rem] phone:font-medium phone:text-black/70 tablet:text-[clamp(1rem,2.1vw,1.25rem)] wide:text-[clamp(0.9375rem,1.8vw,1.1875rem)] lg:ml-[2.55vw] lg:text-[1.4vw] lg:whitespace-nowrap">
                <span className="phone:font-bold phone:text-results-blue">
                  {data.totalFans}
                </span>{" "}
                hinchas censados
              </p>
            )}
          </div>

          <div className="mt-6 phone:mt-1.5 wide:mt-4 lg:mt-[1.35vw]">
            {isOk ? (
              <TopFiveList clubs={data.top} />
            ) : (
              <ResultsState status={status === "ok" ? "error" : status} />
            )}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center font-tiro text-base leading-none italic max-lg:leading-snug max-lg:text-balance phone:mt-2 phone:text-xs phone:text-black/60 tablet:text-lg wide:mt-6 lg:mt-[2.97vw] lg:text-[1.34vw]">
        Proximamente, se podrán ver los resultados por provincia
      </p>
    </section>
  );
}
