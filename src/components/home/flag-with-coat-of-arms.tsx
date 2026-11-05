import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

interface FlagWithCoatOfArmsProps {
  className?: string;
}

/**
 * Bandera del Ecuador con el escudo superpuesto (Sección 1).
 *
 * La bandera se muestra en la proporción del bloque de la referencia
 * (716x709 px sobre 1920x1080) con `object-cover` anclado a la izquierda:
 * el recorte (~1,5% del borde derecho) equivale al sangrado contra el borde
 * de la pantalla que tiene el diseño.
 *
 * Animación B (aprobada por el dueño): el escudo parte desde el borde izquierdo
 * de la bandera y se desplaza una sola vez hacia la derecha ~189 px en escritorio
 * (51% de su propio ancho, proporcional en pantallas menores) con easing
 * suave, y se queda quieto. Todo en porcentajes de la bandera/escudo:
 * - ancho del escudo: 51,7% de la bandera (370 px en la referencia);
 * - centro final: centro de la bandera (50,3% compensa el margen transparente del PNG).
 */
export function FlagWithCoatOfArms({
  className = "",
}: FlagWithCoatOfArmsProps) {
  return (
    <div className={`relative ${className}`}>
      <OwnerImage
        asset={ownerAssets.ecuadorFlag}
        sizes="(min-width: 64rem) 38vw, (min-width: 40rem) 75vw, 92vw"
        preload
        className="aspect-[716/709] object-cover object-left"
      />
      <div className="pointer-events-none absolute top-1/2 left-[50.3%] w-[51.7%] -translate-x-1/2 -translate-y-1/2">
        <div className="animate-coat-slide-in [--coat-start-x:-51%] motion-reduce:animate-none">
          <OwnerImage
            asset={ownerAssets.ecuadorCoatOfArms}
            sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 39vw, 48vw"
            preload
          />
        </div>
      </div>
    </div>
  );
}
