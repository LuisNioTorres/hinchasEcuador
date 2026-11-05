import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

interface BouncingBallProps {
  className?: string;
}

/**
 * Animación A (Sección 1): balón que rebota de arriba hacia abajo de forma
 * lenta, suave y continua. Animación 100% CSS, sin JavaScript en el cliente.
 * Respeta `prefers-reduced-motion`.
 *
 * En phone lleva una sombra de contacto que crece al aterrizar sobre la bandera; el
 * padre debe darle `relative` en esa variante. Desde 475px el balón ya no aterriza
 * sobre la bandera y la sombra desaparece.
 */
export function BouncingBall({ className = "" }: BouncingBallProps) {
  return (
    <div className={className}>
      <div
        aria-hidden="true"
        className="absolute -bottom-1.5 left-[15%] hidden h-2.5 w-[70%] animate-ball-shadow rounded-full bg-black/30 blur-[2px] motion-reduce:animate-none phone:block phone-lg:hidden"
      />
      <div className="animate-ball-bounce motion-reduce:animate-none">
        <OwnerImage
          asset={ownerAssets.footballBall}
          sizes="(min-width: 64rem) 6vw, 120px"
        />
      </div>
    </div>
  );
}
