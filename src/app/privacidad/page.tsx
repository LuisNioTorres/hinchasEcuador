import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ownerAssets } from "@/config/owner-assets";

export const metadata: Metadata = {
  title: "Política de privacidad · Censo Único del Ecuador",
};

const CONTACT_EMAIL = "contacto@censounico.com";
const GOOGLE_POLICY_URL =
  "https://developers.google.com/terms/api-services-user-data-policy";

const LINK =
  "rounded-sm font-semibold text-results-blue underline decoration-results-blue/35 underline-offset-4 transition-colors hover:decoration-results-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue";

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className={`${LINK} break-words`}>
      {CONTACT_EMAIL}
    </a>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-[#0b1f3f]/10 pt-8 lg:mt-12 lg:pt-10">
      <h2 className="text-[1.125rem] leading-snug font-bold tracking-tight text-[#0b1f3f] tablet:text-[1.25rem] lg:text-[1.375rem]">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-2.5 pl-5 marker:text-results-blue [&>li]:list-disc [&>li]:pl-1">
      {children}
    </ul>
  );
}

/**
 * Política de privacidad. Texto aprobado por el dueño el 2026-11-11; se reproduce
 * literal. Es visible sin el enlace de acceso del pre-lanzamiento (`src/proxy.ts`),
 * por eso solo usa el logo como imagen: el resto de `/public` responde 404.
 */
export default function PrivacidadPage() {
  return (
    <div className="min-h-svh bg-bone font-montserrat text-black">
      <header className="border-b border-[#0b1f3f]/10 px-(--page-x) pt-[max(1rem,env(safe-area-inset-top))] pb-4 lg:px-10 lg:py-6">
        <Link
          href="/"
          aria-label="Ir a la página principal"
          className="block w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-results-blue"
        >
          <Image
            src={ownerAssets.companyIcon.src}
            alt={ownerAssets.companyIcon.alt}
            width={ownerAssets.companyIcon.width}
            height={ownerAssets.companyIcon.height}
            preload
            className="h-14 w-auto tablet:h-16 lg:h-[4.75rem]"
          />
        </Link>
      </header>

      <main className="px-(--page-x) pt-10 pb-[max(4rem,calc(env(safe-area-inset-bottom)+3rem))] tablet:pt-14 lg:pt-20 lg:pb-28">
        <article className="mx-auto max-w-[42rem] text-[0.9375rem] leading-[1.7] text-black/75 tablet:text-base lg:text-[1.0625rem]">
          <header className="mb-10 lg:mb-14">
            <h1 className="font-tiro text-[clamp(2.25rem,10vw,3rem)] leading-[1.05] text-[#0b1f3f] italic tablet:text-[3.25rem] lg:text-[3.75rem]">
              Política de privacidad
            </h1>
            <p className="mt-3 text-sm font-medium text-[#0b1f3f]/65">
              Última actualización: 11 de noviembre de 2026
            </p>
            <p className="mt-8 text-[1rem] leading-[1.65] text-black/80 tablet:text-[1.0625rem] lg:text-[1.1875rem]">
              En el Censo Único del Ecuador cuidamos tus datos. Aquí te
              contamos, de forma simple, qué datos guardamos, para qué los
              usamos y cómo puedes pedir que los borremos.
            </p>
          </header>

          <Section title="1. Responsable">
            <p>
              Luis Torres, a cargo del Censo Único del Ecuador (censounico.com).
              <br />
              Contacto: <EmailLink />
            </p>
          </Section>

          <Section title="2. Qué datos guardamos">
            <List>
              <li>
                <strong className="font-semibold text-black">
                  Tu correo electrónico
                </strong>
                , para crear tu cuenta y dejarte entrar.
              </li>
              <li>
                <strong className="font-semibold text-black">
                  Tu nombre y apellido.
                </strong>
              </li>
              <li>
                <strong className="font-semibold text-black">Tu voto:</strong>{" "}
                el club que elegiste, tu provincia y cantón (o tu continente, si
                vives fuera del Ecuador), la fecha y hora en que votaste y tu
                número de voto.
              </li>
              <li>
                <strong className="font-semibold text-black">
                  Datos técnicos
                </strong>
                , como tu dirección IP y tu navegador. Los usamos solo para
                proteger el sitio contra robots y abusos.
              </li>
            </List>
            <p>
              Si entras con Google, Google nos comparte tu nombre, tu correo y
              tu foto de perfil. Solo usamos tu nombre y tu correo.
            </p>
            <p>
              No pedimos cédula, teléfono, dirección ni tu ubicación exacta.
            </p>
          </Section>

          <Section title="3. Para qué los usamos">
            <List>
              <li>Para que puedas entrar y votar una sola vez.</li>
              <li>Para calcular los resultados del censo.</li>
              <li>
                Para proteger el sitio contra robots, cuentas falsas y votos
                duplicados.
              </li>
              <li>
                Para enviarte el correo con tu enlace y tu código de acceso.
              </li>
            </List>
            <p>
              No vendemos tus datos, no los usamos para publicidad y no te
              enviamos correos promocionales.
            </p>
          </Section>

          <Section title="4. Tu voto es privado">
            <p>
              Nadie puede ver por quién votaste. En el sitio solo se publican
              totales, porcentajes y rankings por provincia, cantón y
              continente. Tu nombre y tu correo nunca aparecen en los
              resultados.
            </p>
            <p>
              Una vez emitido, el voto no se puede cambiar. Tu nombre sí lo
              puedes cambiar cuando quieras.
            </p>
          </Section>

          <Section title="5. Con quién compartimos tus datos">
            <p>
              Solo con los servicios que hacen funcionar el sitio y que guardan
              o procesan los datos por nosotros:
            </p>
            <List>
              <li>
                <strong className="font-semibold text-black">Supabase:</strong>{" "}
                base de datos e inicio de sesión.
              </li>
              <li>
                <strong className="font-semibold text-black">Vercel:</strong>{" "}
                alojamiento del sitio.
              </li>
              <li>
                <strong className="font-semibold text-black">
                  Cloudflare:
                </strong>{" "}
                dominio y protección contra robots.
              </li>
              <li>
                <strong className="font-semibold text-black">Resend:</strong>{" "}
                envío de los correos de acceso.
              </li>
              <li>
                <strong className="font-semibold text-black">Google:</strong>{" "}
                solo si eliges entrar con Google.
              </li>
            </List>
            <p>
              Estos servicios tienen servidores fuera del Ecuador,
              principalmente en Estados Unidos. No compartimos tus datos con
              nadie más, salvo que una autoridad competente lo exija por ley.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              Usamos solo las cookies necesarias para mantener tu sesión
              abierta. No usamos cookies de publicidad ni de seguimiento.
            </p>
          </Section>

          <Section title="7. Cuánto tiempo guardamos tus datos">
            <p>
              Mientras exista tu cuenta y el censo siga activo, o hasta que nos
              pidas borrarlos.
            </p>
          </Section>

          <Section title="8. Tus derechos">
            <p>
              Puedes pedirnos ver, corregir o borrar tus datos escribiendo a{" "}
              <EmailLink /> desde el correo de tu cuenta. Te respondemos en un
              plazo máximo de 15 días.
            </p>
            <List>
              <li>
                <strong className="font-semibold text-black">
                  Si no has votado,
                </strong>{" "}
                borramos tu cuenta completa.
              </li>
              <li>
                <strong className="font-semibold text-black">
                  Si ya votaste,
                </strong>{" "}
                borramos tu correo y tu nombre. Tu voto sigue contando en los
                totales, pero sin ningún dato que te identifique.
              </li>
            </List>
          </Section>

          <Section title="9. Datos de Google">
            <p>
              El uso de la información recibida de Google se ajusta a la{" "}
              <a
                href={GOOGLE_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Política de Datos de Usuario de los Servicios de API de Google
              </a>
              , incluidos sus requisitos de Uso Limitado.
            </p>
          </Section>

          <Section title="10. Cambios">
            <p>
              Si cambiamos esta política, publicaremos la nueva versión en esta
              página con su fecha.
            </p>
          </Section>
        </article>
      </main>
    </div>
  );
}
