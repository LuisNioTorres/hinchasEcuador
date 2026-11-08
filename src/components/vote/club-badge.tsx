import Image from "next/image";
import type { Club } from "@/mocks/catalogs";

/**
 * Escudo del club en un círculo blanco. Si su escudo aún no está en el proyecto,
 * muestra solo su color (no se inventan escudos).
 */
export function ClubBadge({
  club,
  className = "size-9",
}: {
  club: Pick<Club, "crest" | "color" | "name">;
  className?: string;
}) {
  if (club.crest) {
    return (
      <span
        className={`relative block shrink-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
      >
        <Image
          src={club.crest}
          alt=""
          fill
          sizes="96px"
          className="object-contain p-[12%]"
        />
      </span>
    );
  }
  return (
    <span
      className={`relative block shrink-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
    >
      <span
        className="absolute inset-[18%] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: club.color }}
      />
    </span>
  );
}
