import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

/** Mensajes de la Sección 3, con el corte de línea de la referencia en desktop. */
const MESSAGES = [
  {
    id: "organizacion",
    bandColor: "phone:bg-hero-censo-bg tablet:bg-hero-censo-bg",
    lines: [
      "Somos el CENSO ÚNICO DEL ECUADOR,",
      "una organización sin fines de lucro.",
    ],
  },
  {
    id: "registro",
    bandColor: "phone:bg-hero-unico-bg tablet:bg-hero-unico-bg",
    lines: [
      "Registrate en la plataforma, y vota por tu",
      "equipo favorito. Es totalmente gratuito.",
    ],
  },
] as const;

/**
 * Sección 3 — Mensaje sobre el proyecto.
 * Referencia: design/references/pagina-principal/PAGINA PRINCIPAL 3.jpg
 *
 * Medidas lg+ en vw sobre el lienzo de 1920px, con origen vertical en la línea
 * separadora de la referencia (y=110). Tipografía: Tiro Bangla.
 *
 * El logo de la empresa (PNG 1200x675) tiene márgenes transparentes; su
 * contenedor (178px) hace que el dibujo visible mida 157x90px como en la
 * referencia.
 *
 * Por debajo de lg:
 * - phone: mide lo mismo que la Sección 1 (`--section-h`). Un solo bloque de tres
 *   franjas seguidas, como la bandera: amarillo y azul con un mensaje y su logo al
 *   lado, y rojo con los escudos. El alto sobrante se reparte entre las franjas.
 * - tablet: el mismo bloque tricolor en horizontal, con amarillo y azul apilados a
 *   la izquierda y el rojo con los escudos a la derecha.
 * - wide: escudos a la izquierda y mensajes a la derecha, como en desktop.
 */
export function AboutSection() {
  return (
    <section
      id="sobre-el-censo"
      className="bg-white py-10 font-tiro text-black max-lg:px-(--page-x) phone:flex phone:min-h-(--section-h) phone:flex-col phone:py-4 tablet:grid tablet:grid-cols-2 tablet:py-10 wide:flex wide:items-center wide:gap-[5vw] wide:py-8 lg:flex lg:min-h-[calc(100svh-var(--header-h)-7.76vw-2px)] lg:items-start lg:p-0"
    >
      <div className="phone:order-last phone:flex phone:flex-[1_1_auto] phone:items-center phone:rounded-b-3xl phone:bg-hero-ecuador-bg phone:p-3 tablet:order-last tablet:flex tablet:items-center tablet:rounded-r-3xl tablet:bg-hero-ecuador-bg tablet:p-4 wide:w-[42%] wide:shrink-0 lg:mt-[7.4vw] lg:ml-[6.09vw] lg:w-[39.9vw] lg:shrink-0">
        <OwnerImage
          asset={ownerAssets.participatingClubsCrests}
          showPlaceholderLabel
        />
      </div>

      <ul className="mt-10 flex flex-col gap-10 phone:mt-0 phone:flex-[1_1_auto] phone:gap-0 tablet:mt-0 tablet:gap-0 wide:mt-0 wide:min-w-0 wide:flex-1 wide:gap-[clamp(1rem,4vw,2.5rem)] lg:mt-[12.17vw] lg:ml-[14.53vw] lg:gap-[10.2vw]">
        {MESSAGES.map((message) => (
          <li
            key={message.id}
            className={`flex items-center gap-3 phone:flex-1 phone:px-4 phone:py-3 phone:first:rounded-t-3xl tablet:flex-1 tablet:gap-3 tablet:px-5 tablet:py-4 tablet:first:rounded-tl-3xl tablet:last:rounded-bl-3xl lg:gap-[1.25vw] ${message.bandColor}`}
          >
            <div className="aspect-[592/632] h-[4.5rem] shrink-0 phone:h-10 tablet:h-[3.25rem] wide:h-[clamp(3.25rem,6.5vw,4.25rem)] lg:h-[6.8vw]">
              <OwnerImage
                asset={ownerAssets.companyIcon}
                sizes="(min-width: 64rem) 7vw, 72px"
              />
            </div>
            <p className="text-lg leading-[1.46] italic max-lg:min-w-0 max-lg:text-pretty phone:text-[clamp(0.9375rem,4vw,1.125rem)] phone:leading-[1.35] tablet:text-[clamp(1.0625rem,2.2vw,1.375rem)] tablet:leading-[1.35] wide:text-[clamp(0.9375rem,2vw,1.25rem)] lg:-translate-y-[0.26vw] lg:text-[1.32vw]">
              {message.lines[0]}
              <br className="hidden lg:inline" /> {message.lines[1]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
