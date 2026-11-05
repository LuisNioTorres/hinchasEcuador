import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

/** Mensajes de la Sección 3, con el corte de línea de la referencia en desktop. */
const MESSAGES = [
  {
    id: "organizacion",
    lines: [
      "Somos el CENSO ÚNICO DEL ECUADOR,",
      "una organización sin fines de lucro.",
    ],
  },
  {
    id: "registro",
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
 * - phone: escudos a todo el ancho y mensajes apilados.
 * - tablet: escudos centrados como protagonista y los dos mensajes lado a lado.
 * - wide: escudos a la izquierda y mensajes a la derecha, como en desktop.
 */
export function AboutSection() {
  return (
    <section
      id="sobre-el-censo"
      className="bg-white py-10 font-tiro text-black max-lg:px-(--page-x) tablet:py-14 wide:flex wide:items-center wide:gap-[5vw] wide:py-8 lg:flex lg:min-h-[calc(100svh-var(--header-h)-7.76vw-2px)] lg:items-start lg:p-0"
    >
      <div className="tablet:mx-auto tablet:w-[78%] tablet:max-w-[40rem] wide:w-[42%] wide:shrink-0 lg:mt-[7.4vw] lg:ml-[6.09vw] lg:w-[39.9vw] lg:shrink-0">
        <OwnerImage
          asset={ownerAssets.participatingClubsCrests}
          showPlaceholderLabel
        />
      </div>

      <ul className="mt-10 flex flex-col gap-10 phone:mt-8 phone:gap-6 tablet:mt-12 tablet:grid tablet:grid-cols-2 tablet:gap-8 wide:mt-0 wide:min-w-0 wide:flex-1 wide:gap-[clamp(1rem,4vw,2.5rem)] lg:mt-[12.17vw] lg:ml-[14.53vw] lg:gap-[10.2vw]">
        {MESSAGES.map((message) => (
          <li
            key={message.id}
            className="flex items-center gap-3 lg:gap-[0.05vw]"
          >
            <div className="w-24 shrink-0 phone:w-[4.5rem] wide:w-[clamp(4.5rem,9vw,6rem)] lg:w-[9.27vw]">
              <OwnerImage
                asset={ownerAssets.companyIcon}
                sizes="(min-width: 64rem) 10vw, 96px"
              />
            </div>
            <p className="text-lg leading-[1.46] italic max-lg:min-w-0 max-lg:text-pretty phone:text-[1.0625rem] tablet:text-[1.1875rem] wide:text-[clamp(0.9375rem,2vw,1.25rem)] lg:-translate-y-[0.26vw] lg:text-[1.32vw]">
              {message.lines[0]}
              <br className="hidden lg:inline" /> {message.lines[1]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
