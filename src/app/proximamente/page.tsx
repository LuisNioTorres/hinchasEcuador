import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ownerAssets } from "@/config/owner-assets";
import { PRIVACY_PAGE } from "@/lib/prelaunch";
import { LoginScene } from "@/components/login/login-scene";

export const metadata: Metadata = {
  title: "Próximamente · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/**
 * Lo único que ve el público durante el pre-lanzamiento (`src/lib/prelaunch.ts`).
 * Texto aprobado por el dueño el 2026-11-10. Usa el escenario, el logo y la tipografía
 * del inicio de sesión, sin formularios. Su único enlace, abajo, lleva a la política
 * de privacidad: Google la exige visible en la portada.
 */
export default function ProximamentePage() {
  return (
    <main className="relative isolate flex min-h-svh flex-col items-center justify-center px-(--page-x) pt-[max(3rem,env(safe-area-inset-top))] pb-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] wide:pb-[max(4rem,calc(env(safe-area-inset-bottom)+3.25rem))] text-center font-montserrat">
      <LoginScene />
      {/* Velo claro detrás del texto: el mapa sigue a la vista, pero no compite con la lectura. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] bg-[radial-gradient(ellipse_70%_45%_at_50%_50%,rgba(247,251,255,0.92)_0%,rgba(247,251,255,0.7)_45%,transparent_100%)]"
      />
      <Image
        src={ownerAssets.companyIcon.src}
        alt={ownerAssets.companyIcon.alt}
        width={ownerAssets.companyIcon.width}
        height={ownerAssets.companyIcon.height}
        preload
        className="h-[5.25rem] w-auto tablet:h-[6.25rem] wide:h-16 lg:h-[clamp(6.5rem,7.25vw,8.75rem)]"
      />
      <h1 className="mt-10 font-tiro text-[clamp(2.5rem,12vw,3.5rem)] leading-[1.05] text-[#0b1f3f] italic tablet:text-[clamp(3.25rem,8vw,4.5rem)] wide:mt-6 wide:text-[clamp(2rem,6vw,2.75rem)] lg:mt-12 lg:text-[clamp(4rem,6vw,6.5rem)]">
        MUY PRONTO, CRACK
      </h1>
      <p className="mt-5 max-w-[34rem] text-[0.8125rem] leading-relaxed font-semibold tracking-wide text-[#0b1f3f]/75 uppercase tablet:text-sm wide:mt-3 wide:text-xs lg:mt-7 lg:max-w-[40rem] lg:text-[clamp(0.875rem,1vw,1.0625rem)]">
        Estamos preparando el Censo Único del Ecuador. Muy pronto podrás
        registrarte y votar por tu equipo favorito. Es totalmente gratuito.
      </p>
      <Link
        href={PRIVACY_PAGE}
        className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 flex h-11 -translate-x-1/2 items-center rounded-full px-4 text-xs font-semibold whitespace-nowrap text-[#0b1f3f]/70 underline decoration-[#0b1f3f]/25 underline-offset-4 transition-colors hover:text-[#0b1f3f] hover:decoration-[#0b1f3f]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue wide:bottom-[max(0.25rem,env(safe-area-inset-bottom))] lg:bottom-6 lg:text-[0.8125rem]"
      >
        Política de privacidad
      </Link>
    </main>
  );
}
