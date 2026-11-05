import { BouncingBall } from "@/components/home/bouncing-ball";
import { FlagWithCoatOfArms } from "@/components/home/flag-with-coat-of-arms";

/**
 * Sección 1 — Identidad del proyecto
 * Referencia: design/references/pagina-principal/PAG PRINCIPAL1.jpg
 *
 * En escritorio (lg+) las posiciones y tamaños se expresan en vw respecto al
 * lienzo de 1920px de la referencia. En tablet y móvil los bloques se apilan
 * conservando todos los elementos.
 *
 * Tamaños tipográficos: `--hero-big` es el tamaño de CENSO / ÚNICO / ECUADOR;
 * el resto se deriva de él con las proporciones medidas en la referencia.
 */
export function HeroSection() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="overflow-x-clip bg-white font-tiro text-black [--hero-big:clamp(2.75rem,14vw,6.5rem)] lg:[--hero-big:5.8vw]"
    >
      <div className="flex min-h-[calc(100svh-var(--header-h)-1px)] flex-col gap-10 px-4 pt-8 pb-12 sm:px-8 lg:flex-row lg:items-start lg:gap-0 lg:p-0">
        <div className="lg:mt-[8.4vw] lg:ml-[5.63vw] lg:w-[37.13vw] lg:shrink-0">
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
          <p className="mt-3 text-[length:max(1rem,calc(var(--hero-big)*0.227))] italic lg:mt-[0.9vw]">
            Ayúdanos a descubrir cuál es el equipo más popular del país.
          </p>
        </div>

        <BouncingBall className="w-20 self-center sm:w-24 lg:mt-[27.95vw] lg:-ml-[0.13vw] lg:[--ball-rise:-125%] lg:w-[5.63vw] lg:shrink-0 lg:self-start" />

        <FlagWithCoatOfArms className="-mr-4 w-[92%] self-end sm:-mr-8 sm:w-[75%] lg:mt-[3.4vw] lg:mr-0 lg:ml-auto lg:self-start lg:w-[37.29vw]" />
      </div>
    </section>
  );
}
