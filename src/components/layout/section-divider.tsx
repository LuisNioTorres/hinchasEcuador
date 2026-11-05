interface SectionDividerProps {
  className?: string;
}

/**
 * Separador sutil entre secciones de la página (línea gris de 1px a todo el
 * ancho, como en las referencias 2 y 3). Es decorativo: no se anuncia a
 * lectores de pantalla.
 */
export function SectionDivider({ className = "" }: SectionDividerProps) {
  return (
    <hr
      aria-hidden="true"
      className={`h-px w-full border-0 bg-divider ${className}`}
    />
  );
}
