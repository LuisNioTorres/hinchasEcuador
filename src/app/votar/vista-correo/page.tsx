import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SimulationNote, TEXT_LINK } from "@/components/login/auth-ui";
import { EmailFrame, RememberedEmail } from "@/components/login/email-frame";
import { AUTH_ROUTES, SAMPLE_CODE } from "@/lib/auth/simulation";

export const metadata: Metadata = {
  title: "Vista previa del correo · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/**
 * SOLO PARA PRUEBAS: muestra el correo de acceso real (supabase/templates/acceso.html)
 * con datos de ejemplo, como si el usuario lo abriera en su bandeja. Se elimina al
 * conectar la autenticación real.
 */
async function readEmailTemplate() {
  "use cache";
  return readFile(
    path.join(process.cwd(), "supabase/templates/acceso.html"),
    "utf8",
  );
}

export default async function VistaCorreoPage() {
  const template = await readEmailTemplate();
  // Los enlaces del correo abren en la pestaña principal, no dentro del marco.
  const html = template
    .replace("<head>", '<head><base target="_top" />')
    .replaceAll("{{ .SiteURL }}", "")
    .replaceAll("{{ .ConfirmationURL }}", AUTH_ROUTES.confirm)
    .replaceAll("{{ .Token }}", SAMPLE_CODE);

  return (
    <main className="min-h-svh bg-[linear-gradient(160deg,#f7fbff_0%,#e4efff_48%,#cddff9_100%)] px-(--page-x) py-10 font-montserrat text-black lg:py-16">
      <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-5">
        <Link
          href={AUTH_ROUTES.checkEmail}
          className={`flex w-fit items-center gap-1.5 text-sm ${TEXT_LINK}`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver a “Revisa tu correo”
        </Link>

        <SimulationNote>
          <p>
            Así verá el usuario el correo en su bandeja. El botón «Iniciar
            sesión» simula el enlace mágico.
          </p>
          <Link href={AUTH_ROUTES.expiredLink} className={`w-fit ${TEXT_LINK}`}>
            Ver cómo se ve un enlace vencido
          </Link>
        </SimulationNote>

        <article className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_1.5rem_3rem_rgba(29,58,115,0.16)]">
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-black/10 px-5 py-4 text-sm">
            <dt className="text-black/50">De</dt>
            <dd className="font-semibold">Censo Único del Ecuador</dd>
            <dt className="text-black/50">Para</dt>
            <dd className="break-all">
              <RememberedEmail />
            </dd>
            <dt className="text-black/50">Asunto</dt>
            <dd className="font-semibold">
              Tu acceso al Censo Único del Ecuador
            </dd>
          </dl>
          <EmailFrame html={html} />
        </article>
      </div>
    </main>
  );
}
