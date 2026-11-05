import { BouncingBall } from "@/components/home/bouncing-ball";
import { FlagWithCoatOfArms } from "@/components/home/flag-with-coat-of-arms";

/**
 * Sección 1 — Identidad del proyecto
 * Referencia: design/references/pagina-principal/PAG PRINCIPAL1.jpg
 *
 * En escritorio (lg+) las posiciones y tamaños se expresan en vw respecto al
 * lienzo de 1920px de la referencia.
 *
 * Por debajo de lg la Sección 1 sigue ocupando una pantalla (100svh):
 * - phone: composición de póster. Título, frase con el balón rebotando a su lado
 *   y la bandera a todo el ancho llenando el alto restante, de modo que no queda
 *   espacio vacío en ningún teléfono. El balón aterriza sobre el borde de la bandera.
 * - tablet: título arriba y, abajo, balón y bandera en la misma fila, con la
 *   bandera sangrando contra el borde derecho como en la referencia.
 * - Horizontal (wide): tres columnas título / balón / bandera, igual que desktop,
 *   con tamaños limitados también por el alto de la pantalla.
 *
 * Tamaños tipográficos: `--hero-big` es el tamaño de CENSO / ÚNICO / ECUADOR;
 * el resto se deriva de él con las proporciones medidas en la referencia.
 */
export function HeroSection() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="overflow-x-clip bg-white font-tiro text-black [--hero-big:min(14.5vw,8svh)] tablet:[--hero-big:min(12vw,8.6svh)] wide:[--hero-big:min(7vw,13.5svh)] lg:[--hero-big:5.8vw]"
    >
      <div className="min-h-[calc(100svh-var(--header-h)-1px)] max-lg:grid max-lg:grid-cols-[minmax(0,1fr)_auto] max-lg:grid-rows-[auto_1fr] max-lg:gap-y-4 max-lg:pt-6 max-lg:pb-6 max-lg:pl-(--page-x) phone:flex phone:min-h-[calc(100svh-var(--header-h)-var(--action-h))] phone:flex-col phone:gap-y-0 phone:p-0 tablet:pt-12 tablet:pb-10 wide:grid-cols-[auto_minmax(0,1fr)_auto] wide:grid-rows-1 wide:items-center wide:py-3 lg:flex lg:flex-row lg:items-start lg:gap-0 lg:p-0">
        <div className="max-lg:col-span-2 max-lg:pr-(--page-x) phone:pt-5 phone:pl-(--page-x) wide:col-span-1 wide:w-[calc(var(--hero-big)*6.4)] wide:pr-0 lg:mt-[8.4vw] lg:ml-[5.63vw] lg:w-[37.13vw] lg:shrink-0">
          <h1
            id="hero-title"
            className="flex flex-col items-start leading-none"
          >
            <span className="ml-[0.06em] text-[length:calc(var(--hero-big)*0.403)]">
              BIENVENIDO AL
            </span>{" "}
            <span className="mt-[0.26em] bg-hero-censo-bg px-[0.03em] pt-[0.24em] pb-0 leading-[0.8] text-[length:var(--hero-big)] text-hero-censo-ink">
              CENSO
            </span>{" "}
            <span className="mt-[0.26em] flex items-end gap-[0.1em] text-[length:var(--hero-big)]">
              <span className="bg-hero-unico-bg px-[0.03em] pt-[0.24em] pb-0 leading-[0.8] text-hero-unico-ink">
                ÚNICO
              </span>{" "}
              <span className="mb-[0.18em] text-[0.5em]">DEL</span>
            </span>{" "}
            <span className="mt-[0.4em] bg-hero-ecuador-bg pt-[0.24em] pb-0 leading-[0.8] pl-[0.03em] text-[length:var(--hero-big)] tracking-[0.15em] text-hero-ecuador-ink">
              ECUADO<span className="tracking-normal">R</span>
            </span>
          </h1>
          <p className="mt-3 text-[length:max(1rem,calc(var(--hero-big)*0.227))] italic phone:mt-0 phone:flex phone:min-h-[6.5rem] phone:items-center phone:pr-[4.75rem] phone:text-[clamp(1rem,4.4vw,1.1875rem)] phone:leading-snug tablet:mt-5 lg:mt-[0.9vw]">
            Ayúdanos a descubrir cuál es el equipo más popular del país.
          </p>
        </div>

        <BouncingBall className="max-lg:mb-[2%] max-lg:w-[clamp(4rem,20vw,7.5rem)] max-lg:self-end max-lg:justify-self-center max-lg:[--ball-rise:-90%] phone:mr-(--page-x) phone:-mt-14 phone:mb-0 phone:w-14 phone:[--ball-rise:-80%] tablet:[--ball-rise:-125%] wide:mb-0 wide:w-[clamp(3rem,8vw,5.5rem)] wide:self-center wide:[--ball-rise:-70%] lg:mt-[27.95vw] lg:-ml-[0.13vw] lg:[--ball-rise:-125%] lg:w-[5.63vw] lg:shrink-0 lg:self-start" />

        <FlagWithCoatOfArms className="max-lg:w-[min(64vw,34svh)] max-lg:self-end max-lg:justify-self-end phone:min-h-28 phone:w-full phone:flex-1 phone:self-stretch tablet:w-[min(58vw,40svh)] wide:w-[min(38vw,72svh)] wide:self-center lg:mt-[3.4vw] lg:mr-0 lg:ml-auto lg:self-start lg:w-[37.29vw]" />
      </div>
    </section>
  );
}
