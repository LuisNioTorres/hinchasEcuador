import Link from "next/link";
import { PRIVACY_PAGE } from "@/lib/prelaunch";

/**
 * Footer de la Página Principal (referencia 3). La referencia solo muestra
 * el texto "footer"; se reproduce literal hasta que el dueño defina su
 * contenido definitivo.
 *
 * El enlace a la política de privacidad va a la derecha desde tablet y, en el
 * teléfono, debajo del texto, dentro de la misma altura (sobre la barra de acción).
 */
export function SiteFooter() {
  return (
    <footer className="relative flex h-[calc(5rem+env(safe-area-inset-bottom))] flex-col items-center justify-center bg-bone pb-[env(safe-area-inset-bottom)] font-tiro text-black phone:h-[calc(3.5rem+var(--action-h))] phone:pb-(--action-h) tablet:h-[calc(4rem+env(safe-area-inset-bottom))] lg:h-[7.76vw] lg:pb-0">
      <p className="text-lg leading-none italic lg:text-[1.35vw]">footer</p>
      <Link
        href={PRIVACY_PAGE}
        className="relative flex h-9 items-center rounded-full px-3 font-montserrat text-xs font-semibold text-black/65 underline decoration-black/25 underline-offset-4 transition-colors before:absolute before:-inset-y-1 before:inset-x-0 hover:text-black hover:decoration-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue phone:mt-0.5 tablet:absolute tablet:top-[calc((100%-env(safe-area-inset-bottom))/2)] tablet:right-[calc(var(--page-x)-0.75rem)] tablet:-translate-y-1/2 wide:absolute wide:top-[calc((100%-env(safe-area-inset-bottom))/2)] wide:right-[calc(var(--page-x)-0.75rem)] wide:-translate-y-1/2 lg:absolute lg:top-1/2 lg:right-[calc(max(2.5rem,4vw)-0.75rem)] lg:-translate-y-1/2 lg:text-[0.8125rem]"
      >
        Política de privacidad
      </Link>
    </footer>
  );
}
