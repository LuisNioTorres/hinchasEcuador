import type { Metadata } from "next";
import Image from "next/image";
import { ownerAssets } from "@/config/owner-assets";
import { LoginScene } from "@/components/login/login-scene";

export const metadata: Metadata = {
  title: "Próximamente · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/**
 * Lo único que ve el público durante el pre-lanzamiento (`src/lib/prelaunch.ts`).
 * Texto aprobado por el dueño el 2026-11-10. Usa el escenario, el logo y la tipografía
 * del inicio de sesión, sin enlaces ni formularios: no hay nada más que ver.
 */
export default function ProximamentePage() {
  return (
    <main className="relative isolate flex min-h-svh flex-col items-center justify-center px-(--page-x) py-[max(3rem,env(safe-area-inset-top))] text-center font-montserrat">
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
        className="h-auto w-[7rem] tablet:w-[8.5rem] lg:w-[clamp(9rem,10vw,12rem)]"
      />
      <h1 className="mt-10 font-tiro text-[clamp(2.5rem,12vw,3.5rem)] leading-[1.05] text-[#0b1f3f] italic tablet:text-[clamp(3.25rem,8vw,4.5rem)] wide:mt-6 wide:text-[clamp(2rem,6vw,2.75rem)] lg:mt-12 lg:text-[clamp(4rem,6vw,6.5rem)]">
        MUY PRONTO, CRACK
      </h1>
      <p className="mt-5 max-w-[34rem] text-[0.8125rem] leading-relaxed font-semibold tracking-wide text-[#0b1f3f]/75 uppercase tablet:text-sm wide:mt-3 wide:text-xs lg:mt-7 lg:max-w-[40rem] lg:text-[clamp(0.875rem,1vw,1.0625rem)]">
        Estamos preparando el Censo Único del Ecuador. Muy pronto podrás
        registrarte y votar por tu equipo favorito. Es totalmente gratuito.
      </p>
    </main>
  );
}
