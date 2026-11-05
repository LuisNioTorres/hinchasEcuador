import { BouncingBall } from "@/components/home/bouncing-ball";
import { FlagWithCoatOfArms } from "@/components/home/flag-with-coat-of-arms";

/**
 * Sección 1 — Identidad del proyecto
 * Referencia: design/references/pagina-principal/PAG PRINCIPAL1.jpg
 *
 * En escritorio (lg+) la sección ocupa el 75% del alto. Posiciones y tamaños se
 * expresan en `--u` respecto al lienzo de 1920px de la referencia: `--u` vale 1vw,
 * salvo en pantallas proporcionalmente bajas, donde se reduce para que la composición
 * quepa en ese 75%. `--hero-pad` la centra verticalmente.
 *
 * Por debajo de lg la Sección 1 ocupa una pantalla (100svh), salvo en phone y en
 * tablet, donde ocupa el 75% del alto (`--hero-pad` centra el título, cuyo alto es
 * 5,2925 veces --hero-big más su margen, y permite colocar el balón junto a ECUADOR):
 * - phone: composición compacta, sin ocupar toda la pantalla, para que la siguiente
 *   sección asome. Título, frase con el balón rebotando a su lado y la bandera como
 *   una franja a todo el ancho. El balón aterriza sobre el borde de la bandera.
 * - phone-lg (475-767px): el balón pasa a la derecha de ECUADOR y rebota como en
 *   desktop, y la bandera se queda en 475px, centrada, para no estirarse de más.
 * - tablet: composición compacta con el título a la izquierda y la bandera sangrando
 *   contra el borde derecho. El balón va a la derecha de ECUADOR y baja hasta su
 *   borde inferior, con el mismo recorrido proporcional que en desktop.
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
      className="overflow-x-clip bg-white font-tiro text-black [--hero-big:min(14.5vw,8svh)] phone-lg:[--hero-big:min(13vw,8svh)] tablet:[--hero-big:6.6vw] tablet:[--hero-pad:max(2.5rem,calc((75svh-var(--hero-big)*5.2925-0.75rem)/2))] wide:[--hero-big:min(7vw,13.5svh)] lg:[--hero-big:calc(var(--u)*5.8)] lg:[--hero-pad:calc((75svh-var(--u)*36.93)/2-var(--u)*3.4)] lg:[--u:min(1vw,1.715svh)]"
    >
      <div className="min-h-[calc(100svh-var(--header-h)-1px)] max-lg:grid max-lg:grid-cols-[minmax(0,1fr)_auto] max-lg:grid-rows-[auto_1fr] max-lg:gap-y-4 max-lg:pt-6 max-lg:pb-6 max-lg:pl-(--page-x) phone:flex phone:min-h-0 phone:flex-col phone:gap-y-0 phone:p-0 phone-lg:relative tablet:relative tablet:min-h-[75svh] tablet:grid-cols-[auto_minmax(0,1fr)] tablet:grid-rows-1 tablet:items-start tablet:py-(--hero-pad) wide:grid-cols-[auto_minmax(0,1fr)_auto] wide:grid-rows-1 wide:items-center wide:py-3 lg:flex lg:min-h-[75svh] lg:flex-row lg:items-start lg:gap-0 lg:p-0 lg:pt-(--hero-pad)">
        <div className="max-lg:col-span-2 max-lg:pr-(--page-x) phone:pt-5 phone:pl-(--page-x) tablet:col-span-1 tablet:w-[calc(var(--hero-big)*6)] tablet:pr-0 wide:col-span-1 wide:w-[calc(var(--hero-big)*6.4)] wide:pr-0 lg:mt-[calc(var(--u)*8.4)] lg:ml-[calc(var(--u)*5.63)] lg:w-[calc(var(--u)*37.13)] lg:shrink-0">
          <h1
            id="hero-title"
            className="flex flex-col items-start leading-none"
          >
            <span className="ml-[0.06em] text-[length:calc(var(--hero-big)*0.403)] phone:tracking-[0.06em] tablet:tracking-[0.06em]">
              BIENVENIDO AL
            </span>{" "}
            <span className="mt-[0.26em] bg-hero-censo-bg px-[0.03em] pt-[0.24em] pb-0 leading-[0.8] text-[length:var(--hero-big)] text-hero-censo-ink phone:rounded-md tablet:rounded-md">
              CENSO
            </span>{" "}
            <span className="mt-[0.26em] flex items-end gap-[0.1em] text-[length:var(--hero-big)]">
              <span className="bg-hero-unico-bg px-[0.03em] pt-[0.24em] pb-0 leading-[0.8] text-hero-unico-ink phone:rounded-md tablet:rounded-md">
                ÚNICO
              </span>{" "}
              <span className="mb-[0.18em] text-[0.5em]">DEL</span>
            </span>{" "}
            <span className="mt-[0.4em] bg-hero-ecuador-bg pt-[0.24em] pb-0 leading-[0.8] pl-[0.03em] text-[length:var(--hero-big)] tracking-[0.15em] text-hero-ecuador-ink phone:rounded-md tablet:rounded-md">
              ECUADO<span className="tracking-normal">R</span>
            </span>
          </h1>
          <p className="mt-3 text-[length:max(1rem,calc(var(--hero-big)*0.227))] italic phone:mt-0 phone:flex phone:min-h-[6rem] phone:items-start phone:pt-2.5 phone:pr-[4.75rem] phone:text-[clamp(0.875rem,3.6vw,1rem)] phone:leading-snug phone:text-balance phone-lg:min-h-[4.5rem] phone-lg:max-w-[calc(var(--hero-big)*5.96)] phone-lg:pr-0 tablet:mt-3 tablet:text-[length:calc(var(--hero-big)*0.31)] tablet:leading-snug lg:mt-[calc(var(--u)*0.9)]">
            Ayúdanos a descubrir cuál es el equipo más popular del país.
          </p>
        </div>

        <BouncingBall className="max-lg:mb-[2%] max-lg:w-[clamp(4rem,20vw,7.5rem)] max-lg:self-end max-lg:justify-self-center max-lg:[--ball-rise:-90%] phone:relative phone:z-10 phone:mr-(--page-x) phone:-mt-16 phone:mb-0 phone:w-16 phone:[--ball-rise:-47%] phone-lg:absolute phone-lg:top-[calc(1.25rem+var(--hero-big)*4.44-var(--ball-w))] phone-lg:left-[calc(var(--page-x)+var(--hero-big)*5.96+0.75rem)] phone-lg:mt-0 phone-lg:mr-0 phone-lg:w-(--ball-w) phone-lg:[--ball-rise:-125%] phone-lg:[--ball-w:clamp(3.25rem,11vw,5.5rem)] tablet:absolute tablet:top-[calc(var(--hero-pad)+var(--hero-big)*4.44-var(--ball-w))] tablet:left-[calc(var(--page-x)+var(--hero-big)*5.96+0.75rem)] tablet:mb-0 tablet:w-(--ball-w) tablet:[--ball-rise:-125%] tablet:[--ball-w:5.5vw] wide:mb-0 wide:w-[clamp(3rem,8vw,5.5rem)] wide:self-center wide:[--ball-rise:-70%] lg:mt-[calc(var(--u)*27.95)] lg:ml-[calc(var(--u)*-0.13)] lg:[--ball-rise:-125%] lg:w-[calc(var(--u)*5.63)] lg:shrink-0 lg:self-start" />

        <FlagWithCoatOfArms className="max-lg:w-[min(64vw,34svh)] max-lg:self-end max-lg:justify-self-end phone:h-[clamp(8.5rem,24svh,14rem)] phone:w-full phone:self-stretch phone:overflow-hidden phone:rounded-t-[2rem] phone-lg:w-[29.6875rem] phone-lg:self-center tablet:w-[35vw] tablet:self-center tablet:overflow-hidden tablet:rounded-l-[2rem] wide:w-[min(38vw,72svh)] wide:self-center lg:mt-[calc(var(--u)*3.4)] lg:mr-0 lg:ml-auto lg:self-start lg:w-[calc(var(--u)*37.29)]" />
      </div>
    </section>
  );
}
