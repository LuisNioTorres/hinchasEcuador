import { ownerAssets } from "@/config/owner-assets";
import { OwnerImage } from "@/components/ui/owner-image";

interface BouncingBallProps {
  className?: string;
}

/**
 * Animación A (Sección 1): balón que rebota de arriba hacia abajo de forma
 * lenta, suave y continua. Animación 100% CSS, sin JavaScript en el cliente.
 * Respeta `prefers-reduced-motion`.
 */
export function BouncingBall({ className = "" }: BouncingBallProps) {
  return (
    <div className={className}>
      <div className="animate-ball-bounce motion-reduce:animate-none">
        <OwnerImage
          asset={ownerAssets.footballBall}
          sizes="(min-width: 64rem) 6vw, 96px"
        />
      </div>
    </div>
  );
}
