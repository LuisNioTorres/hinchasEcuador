/**
 * Footer de la Página Principal (referencia 3). La referencia solo muestra
 * el texto "footer"; se reproduce literal hasta que el dueño defina su
 * contenido definitivo.
 */
export function SiteFooter() {
  return (
    <footer className="flex h-[calc(5rem+env(safe-area-inset-bottom))] items-center justify-center bg-bone pb-[env(safe-area-inset-bottom)] font-tiro text-black phone:h-[calc(3.5rem+var(--action-h))] phone:pb-(--action-h) tablet:h-[calc(4rem+env(safe-area-inset-bottom))] lg:h-[7.76vw] lg:pb-0">
      <p className="text-lg leading-none italic lg:text-[1.35vw]">footer</p>
    </footer>
  );
}
