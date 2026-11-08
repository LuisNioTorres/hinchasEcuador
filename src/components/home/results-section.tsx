import { ClubSelectionProvider } from "@/components/home/results/club-selection";
import { EcuadorMap } from "@/components/home/results/ecuador-map";
import { TopFiveList } from "@/components/home/results/top-five-list";
import { ResultsState } from "@/components/home/results/results-state";
import type { ProvinceLeaders } from "@/lib/results/province-leaders";
import type { NationalResultsResponse } from "@/mocks/national-results";

interface ResultsSectionProps {
  results: NationalResultsResponse;
  provinceLeaders: ProvinceLeaders;
}

/**
 * Sección 2 — Resultados nacionales.
 * Referencia: design/references/pagina-principal/PAG PRINCIPAL 2.jpg
 *
 * Medidas lg+ en vw sobre el lienzo de 1920px, tomando como origen vertical
 * la línea separadora de la referencia (y=110). Tipografía: Montserrat.
 * En lg+ el contenido se centra en vertical dentro del alto de la sección.
 *
 * Por debajo de lg:
 * - phone: TOP 5 compacto (máximo 380px de ancho) y, debajo, el mapa centrado (máximo
 *   290x330px), para que ambos quepan juntos en pantalla. "Proximamente…" es una
 *   nota pequeña al pie del mapa.
 * - tablet: mapa a la izquierda con la nota al pie y TOP 5 a la derecha, con el
 *   acabado de teléfono. El contenedor usa `contents` para que el mapa, el TOP 5 y
 *   la nota entren en la misma rejilla.
 * - wide: mapa a la izquierda y TOP 5 a la derecha, como en desktop.
 *
 * Al elegir un club del TOP 5, el mapa resalta las provincias donde lidera.
 */
export function ResultsSection({
  results,
  provinceLeaders,
}: ResultsSectionProps) {
  const { status, data } = results;
  const isOk = status === "ok" && data !== null;

  return (
    <section
      id="resultados-nacionales"
      aria-labelledby="resultados-title"
      className="bg-bone py-10 font-montserrat text-black max-lg:px-(--page-x) phone:py-4 tablet:grid tablet:grid-cols-[48%_minmax(0,1fr)] tablet:gap-x-[4vw] tablet:py-10 wide:py-8 lg:flex lg:min-h-[calc(100svh-var(--header-h)-1px)] lg:flex-col lg:justify-center lg:px-0 lg:py-[0.68vw]"
    >
      <h2
        id="resultados-title"
        className="mx-auto flex w-fit items-center justify-center rounded-xl border-2 border-black bg-results-blue px-6 py-3 text-center text-2xl leading-[1.4] font-semibold text-white phone:h-11 phone:w-full phone:rounded-lg phone:border phone:border-black/40 phone:px-3 phone:py-0 phone:text-[clamp(1rem,4.9vw,1.5rem)] phone:leading-[1.25] phone:font-bold tablet:col-span-2 tablet:h-14 tablet:rounded-xl tablet:border tablet:border-black/40 tablet:px-10 tablet:py-0 tablet:text-[clamp(1.5rem,3vw,1.875rem)] tablet:leading-[1.25] tablet:font-bold wide:px-8 wide:py-2 wide:text-[clamp(1.25rem,2.6vw,1.75rem)] lg:h-[6.56vw] lg:w-[22.92vw] lg:rounded-[0.63vw] lg:border-[length:max(2px,0.1vw)] lg:p-0 lg:text-[1.93vw]"
      >
        RESULTADOS <br className="phone:hidden tablet:hidden" />
        NACIONALES
      </h2>

      <ClubSelectionProvider>
        <div className="mt-10 flex flex-col gap-10 phone:mt-2.5 phone:gap-3 tablet:contents wide:mt-6 wide:flex-row wide:items-center wide:gap-[5vw] lg:mt-0 lg:flex-row lg:items-start lg:gap-0">
          <div className="phone:order-last phone:mx-auto phone:w-[min(100%,18.125rem,calc((100svh-var(--header-h)-var(--action-h)-3rem)*0.8787))] tablet:mt-8 tablet:w-full wide:w-[36%] wide:shrink-0 lg:mt-[3.07vw] lg:ml-[11.98vw] lg:w-[29.43vw] lg:shrink-0">
            <EcuadorMap leaders={provinceLeaders} />
          </div>

          <div className="phone:mx-auto phone:w-full phone:max-w-[23.75rem] tablet:row-span-2 tablet:mt-8 tablet:min-w-0 tablet:self-center wide:min-w-0 wide:flex-1 lg:mt-[2.76vw] lg:ml-[15.36vw] lg:w-[30.63vw] lg:shrink-0">
            <div className="flex items-center gap-6 max-lg:justify-between max-lg:gap-3 lg:gap-0">
              <p className="ml-3 flex h-12 w-36 -skew-x-[21deg] max-lg:shrink-0 phone:ml-2 phone:h-8 phone:w-[5.5rem] phone:rounded-md phone:border-2 tablet:ml-2 tablet:h-10 tablet:w-[6.75rem] tablet:rounded-lg tablet:border-[3px] wide:h-11 wide:w-[clamp(7.5rem,14vw,9rem)] items-center justify-center rounded-xl border-4 border-black bg-white lg:ml-[0.78vw] lg:h-[3.54vw] lg:w-[9.9vw] lg:rounded-[0.63vw] lg:border-[length:max(3px,0.21vw)]">
                <span className="skew-x-[21deg] text-2xl leading-none font-bold phone:text-[1.0625rem] tablet:text-xl lg:text-[1.93vw]">
                  TOP 5
                </span>
              </p>
              {isOk && (
                <p className="text-lg leading-none font-semibold max-lg:text-right max-lg:leading-tight max-lg:text-balance phone:text-[0.9375rem] phone:font-medium phone:text-black/70 tablet:text-[clamp(1rem,2.1vw,1.25rem)] tablet:font-medium tablet:text-black/70 wide:text-[clamp(0.9375rem,1.8vw,1.1875rem)] lg:ml-[2.55vw] lg:text-[1.4vw] lg:whitespace-nowrap">
                  <span className="phone:font-bold phone:text-results-blue tablet:font-bold tablet:text-results-blue">
                    {data.totalFans}
                  </span>{" "}
                  {data.totalFans === 1 ? "hincha censado" : "hinchas censados"}
                </p>
              )}
            </div>

            <div className="mt-6 phone:mt-1.5 tablet:mt-4 wide:mt-4 lg:mt-[1.35vw]">
              {isOk ? (
                <TopFiveList clubs={data.top} />
              ) : (
                <ResultsState status={status === "ok" ? "error" : status} />
              )}
            </div>
          </div>
        </div>
      </ClubSelectionProvider>

      <p className="mt-10 text-center font-tiro text-base leading-none italic max-lg:leading-snug max-lg:text-balance phone:mt-2 phone:text-xs phone:text-black/60 tablet:mt-3 tablet:text-[0.8125rem] tablet:text-black/60 wide:mt-6 lg:mt-[2.97vw] lg:text-[1.34vw]">
        Proximamente, se podrán ver los resultados por provincia
      </p>
    </section>
  );
}
