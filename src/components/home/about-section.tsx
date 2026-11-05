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
 * Sección 3 — Mensaje sobre el proyecto (solo versión desktop por ahora).
 * Referencia: design/references/pagina-principal/PAGINA PRINCIPAL 3.jpg
 *
 * Medidas lg+ en vw sobre el lienzo de 1920px, con origen vertical en la línea
 * separadora de la referencia (y=110). Tipografía: Tiro Bangla.
 *
 * El logo de la empresa (PNG 1200x675) tiene márgenes transparentes; su
 * contenedor (178px) hace que el dibujo visible mida 157x90px como en la
 * referencia.
 */
export function AboutSection() {
  return (
    <section
      id="sobre-el-censo"
      className="bg-white px-4 py-10 font-tiro text-black lg:flex lg:min-h-[calc(100svh-var(--header-h)-7.76vw-2px)] lg:items-start lg:p-0"
    >
      <div className="lg:mt-[7.4vw] lg:ml-[6.09vw] lg:w-[39.9vw] lg:shrink-0">
        <OwnerImage
          asset={ownerAssets.participatingClubsCrests}
          showPlaceholderLabel
        />
      </div>

      <ul className="mt-10 flex flex-col gap-10 lg:mt-[12.17vw] lg:ml-[14.53vw] lg:gap-[10.2vw]">
        {MESSAGES.map((message) => (
          <li
            key={message.id}
            className="flex items-center gap-3 lg:gap-[0.05vw]"
          >
            <div className="w-24 shrink-0 lg:w-[9.27vw]">
              <OwnerImage
                asset={ownerAssets.companyIcon}
                sizes="(min-width: 64rem) 10vw, 96px"
              />
            </div>
            <p className="text-lg leading-[1.46] italic lg:-translate-y-[0.26vw] lg:text-[1.32vw]">
              {message.lines[0]}
              <br className="hidden lg:inline" /> {message.lines[1]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
